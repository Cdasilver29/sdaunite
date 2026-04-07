import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SANDBOX_URL = "https://sandbox.safaricom.co.ke";
const PRODUCTION_URL = "https://api.safaricom.co.ke";

async function getOAuthToken(baseUrl: string, key: string, secret: string): Promise<string> {
  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth failed: ${res.status}`);
  return data.access_token;
}

function normalizePhone(phone: string): string {
  let c = phone.replace(/[\s\-\+]/g, "");
  if (c.startsWith("0")) c = "254" + c.slice(1);
  if (!/^254[17]\d{8}$/.test(c)) throw new Error("Invalid Kenyan phone number");
  return c;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { phone_number, amount } = await req.json();

    if (!phone_number || !amount || amount < 1) {
      return new Response(JSON.stringify({ error: "Missing phone_number or valid amount" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const normalizedPhone = normalizePhone(phone_number);
    const roundedAmount = Math.ceil(amount);

    // Create payment record
    const { data: payment, error: payErr } = await adminClient.from("payments").insert({
      user_id: user.id,
      amount: roundedAmount,
      currency: "KES",
      payment_method: "mpesa",
      payment_status: "pending",
      phone_number: normalizedPhone,
      payment_provider_reference: `CAMP-DONATE-${Date.now()}`,
    }).select("id").single();

    if (payErr) throw payErr;

    // M-Pesa STK Push
    const mpesaEnv = Deno.env.get("MPESA_ENVIRONMENT") || "sandbox";
    const baseUrl = mpesaEnv === "production" ? PRODUCTION_URL : SANDBOX_URL;
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL");

    if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
      await adminClient.from("payments").update({ payment_status: "failed" }).eq("id", payment.id);
      return new Response(JSON.stringify({ error: "M-Pesa config incomplete" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const accessToken = await getOAuthToken(baseUrl, consumerKey, consumerSecret);

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: roundedAmount,
        PartyA: normalizedPhone,
        PartyB: shortcode,
        PhoneNumber: normalizedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `CampMeeting-${payment.id.slice(0, 8)}`,
        TransactionDesc: "Camp Meeting Donation",
      }),
    });

    const stkData = await stkRes.json().catch(() => null);
    if (!stkData || stkData.ResponseCode !== "0") {
      await adminClient.from("payments").update({ payment_status: "failed" }).eq("id", payment.id);
      return new Response(JSON.stringify({ error: "STK Push failed", detail: stkData?.ResponseDescription || stkData?.errorMessage }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await adminClient.from("payments").update({ mpesa_checkout_request_id: stkData.CheckoutRequestID }).eq("id", payment.id);

    return new Response(JSON.stringify({ success: true, payment_id: payment.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Camp meeting donate error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
