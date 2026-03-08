/**
 * M-Pesa STK Push Edge Function
 * ==============================
 * 
 * ARCHITECTURE:
 * Frontend → this function → Safaricom Daraja API → STK Push on user's phone
 * 
 * FLOW:
 * 1. Receive ticket_type_id, phone_number, event_id from authenticated user
 * 2. Validate inputs & fetch ticket price
 * 3. Get OAuth token from Safaricom
 * 4. Create pending payment record
 * 5. Initiate STK Push
 * 6. Store CheckoutRequestID for callback matching
 * 7. Return payment_id to frontend for polling
 * 
 * SECURITY:
 * - Requires authenticated user (JWT verified in code)
 * - Phone number validated (Kenyan format)
 * - Amount fetched from DB, not from client
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Safaricom API endpoints
const SANDBOX_URL = "https://sandbox.safaricom.co.ke";
const PRODUCTION_URL = "https://api.safaricom.co.ke";

/**
 * Get OAuth token from Safaricom Daraja API
 * Token is valid for 1 hour but we fetch fresh each time for simplicity
 */
async function getOAuthToken(baseUrl: string, consumerKey: string, consumerSecret: string): Promise<string> {
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${credentials}` },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`OAuth token fetch failed: ${res.status} - ${text}`);
  }

  try {
    const data = JSON.parse(text);
    return data.access_token;
  } catch {
    throw new Error(`OAuth response is not valid JSON: ${text.slice(0, 200)}`);
  }
}

/**
 * Generate M-Pesa password
 * Password = Base64(Shortcode + Passkey + Timestamp)
 */
function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  return btoa(`${shortcode}${passkey}${timestamp}`);
}

/**
 * Generate timestamp in format YYYYMMDDHHmmss
 */
function generateTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

/**
 * Normalize Kenyan phone number to 254XXXXXXXXX format
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\+]/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (!/^254[17]\d{8}$/.test(cleaned)) {
    throw new Error("Invalid Kenyan phone number. Use format: 0712345678 or 254712345678");
  }
  return cleaned;
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- 1. Auth check ---
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // User client for auth verification
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for DB operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // --- 2. Parse & validate input ---
    const body = await req.json();
    const { ticket_type_id, event_id, phone_number } = body;

    if (!ticket_type_id || !event_id || !phone_number) {
      return new Response(JSON.stringify({ error: "Missing required fields: ticket_type_id, event_id, phone_number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedPhone = normalizePhone(phone_number);

    // --- 3. Fetch ticket type to get authoritative price ---
    const { data: ticketType, error: ttError } = await adminClient
      .from("ticket_types")
      .select("id, price, currency, event_id, name")
      .eq("id", ticket_type_id)
      .eq("event_id", event_id)
      .single();

    if (ttError || !ticketType) {
      return new Response(JSON.stringify({ error: "Ticket type not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = Math.ceil(ticketType.price); // M-Pesa requires whole numbers

    // --- 4. Handle free tickets (no payment needed) ---
    if (amount === 0) {
      const qrCode = crypto.randomUUID();
      const { data: ticket, error: ticketErr } = await adminClient
        .from("tickets")
        .insert({
          event_id,
          ticket_type_id,
          user_id: user.id,
          qr_code: qrCode,
          ticket_status: "valid",
        })
        .select("id")
        .single();

      if (ticketErr) throw ticketErr;

      return new Response(JSON.stringify({ 
        success: true, 
        free: true, 
        ticket_id: ticket.id,
        message: "Free ticket issued successfully" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- 5. Create pending payment record ---
    const transactionRef = `SDA-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    
    const { data: payment, error: payErr } = await adminClient
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        currency: ticketType.currency || "KES",
        payment_method: "mpesa",
        payment_status: "pending",
        phone_number: normalizedPhone,
        payment_provider_reference: transactionRef,
      })
      .select("id")
      .single();

    if (payErr) throw payErr;

    // --- 6. Get M-Pesa credentials ---
    const mpesaEnv = Deno.env.get("MPESA_ENVIRONMENT") || "sandbox";
    const baseUrl = mpesaEnv === "production" ? PRODUCTION_URL : SANDBOX_URL;
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL");

    if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
      // Update payment to failed if credentials missing
      await adminClient.from("payments").update({ payment_status: "failed" }).eq("id", payment.id);
      return new Response(JSON.stringify({ error: "M-Pesa configuration incomplete" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- 7. Get OAuth token ---
    const accessToken = await getOAuthToken(baseUrl, consumerKey, consumerSecret);

    // --- 8. Initiate STK Push ---
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    /**
     * STK Push Request Body
     * 
     * BusinessShortCode: Your M-Pesa shortcode (paybill/till)
     * Password: Base64(Shortcode + Passkey + Timestamp)  
     * Timestamp: YYYYMMDDHHmmss
     * TransactionType: CustomerPayBillOnline (paybill) or CustomerBuyGoodsOnline (till)
     * Amount: Payment amount (whole number)
     * PartyA: Customer phone number (254XXXXXXXXX)
     * PartyB: Your shortcode
     * PhoneNumber: Customer phone for STK prompt
     * CallBackURL: Webhook to receive payment result
     * AccountReference: Reference shown on M-Pesa statement
     * TransactionDesc: Description of transaction
     */
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `SDAUnite-${payment.id.slice(0, 8)}`,
      TransactionDesc: `Ticket: ${ticketType.name}`,
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      // STK Push failed — mark payment as failed
      await adminClient.from("payments").update({ payment_status: "failed" }).eq("id", payment.id);
      return new Response(JSON.stringify({ 
        error: "STK Push failed", 
        detail: stkData.ResponseDescription || stkData.errorMessage 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- 9. Store CheckoutRequestID for callback matching ---
    await adminClient
      .from("payments")
      .update({ mpesa_checkout_request_id: stkData.CheckoutRequestID })
      .eq("id", payment.id);

    // --- 10. Return payment ID for frontend polling ---
    return new Response(JSON.stringify({
      success: true,
      payment_id: payment.id,
      checkout_request_id: stkData.CheckoutRequestID,
      message: "STK Push sent. Check your phone to complete payment.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("STK Push error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
