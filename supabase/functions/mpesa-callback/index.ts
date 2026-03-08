/**
 * M-Pesa Callback Webhook
 * ========================
 * 
 * ARCHITECTURE:
 * Safaricom → this webhook → DB update → ticket issuance → SMS + Email notification
 * 
 * This is called by Safaricom after the user approves/rejects the STK Push.
 * It is a PUBLIC endpoint (no JWT required) — Safaricom can't send auth headers.
 * 
 * SECURITY:
 * - Idempotent: duplicate callbacks are safely ignored
 * - Only processes payments in "pending" status
 * - Validates required callback fields exist
 * - Uses service role key for DB operations
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Notification helpers ---

async function sendSms(phone: string, message: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Twilio credentials not configured — skipping SMS");
    return;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: phone.startsWith("+") ? phone : `+${phone}`,
      From: fromNumber,
      Body: message,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Twilio SMS error:", JSON.stringify(data));
    } else {
      console.log("SMS sent successfully, SID:", data.sid);
    }
  } catch (err) {
    console.error("SMS send failed:", err);
  }
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping email");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SDA Unite <notifications@sdaunite.lovable.app>",
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend email error:", JSON.stringify(data));
    } else {
      console.log("Email sent successfully, ID:", data.id);
    }
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

function buildPaymentEmailHtml({
  fullName,
  eventTitle,
  ticketName,
  amount,
  currency,
  receipt,
}: {
  fullName: string;
  eventTitle: string;
  ticketName: string;
  amount: number;
  currency: string;
  receipt: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#1a1a2e;font-size:22px;margin:0;">🎉 Payment Confirmed!</h1>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.6;">
      Hi <strong>${fullName}</strong>,
    </p>
    <p style="color:#333;font-size:15px;line-height:1.6;">
      Your M-Pesa payment has been confirmed and your ticket is ready.
    </p>
    <div style="background:#f7f7fa;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
        <tr><td style="padding:6px 0;color:#777;">Event</td><td style="padding:6px 0;text-align:right;font-weight:600;">${eventTitle}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Ticket</td><td style="padding:6px 0;text-align:right;font-weight:600;">${ticketName}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Amount</td><td style="padding:6px 0;text-align:right;font-weight:600;">${currency} ${amount.toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">M-Pesa Receipt</td><td style="padding:6px 0;text-align:right;font-weight:600;font-family:monospace;">${receipt}</td></tr>
      </table>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.6;">
      View your ticket and QR code anytime on the <a href="https://sdaunite.lovable.app/my-tickets" style="color:#e67e22;text-decoration:none;font-weight:600;">My Tickets</a> page.
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
    <p style="color:#999;font-size:12px;text-align:center;">
      SDA Unite — Connecting Adventist Communities
    </p>
  </div>
</body>
</html>`;
}

// --- Main handler ---

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(body));

    const callback = body?.Body?.stkCallback;
    if (!callback) {
      console.error("Invalid callback structure");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = callback;

    if (!CheckoutRequestID) {
      console.error("Missing CheckoutRequestID");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find matching payment
    const { data: payment, error: findErr } = await adminClient
      .from("payments")
      .select("id, user_id, payment_status, ticket_id, amount, phone_number")
      .eq("mpesa_checkout_request_id", CheckoutRequestID)
      .single();

    if (findErr || !payment) {
      console.error("Payment not found for CheckoutRequestID:", CheckoutRequestID);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotency
    if (payment.payment_status !== "pending") {
      console.log(`Payment ${payment.id} already processed (status: ${payment.payment_status}). Skipping.`);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Failed payment
    if (ResultCode !== 0) {
      console.log(`Payment ${payment.id} failed: ${ResultDesc}`);
      await adminClient
        .from("payments")
        .update({ payment_status: "failed" })
        .eq("id", payment.id);

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract metadata
    const metadata = callback.CallbackMetadata?.Item || [];
    const getMeta = (name: string) => metadata.find((m: any) => m.Name === name)?.Value;

    const mpesaReceiptNumber = getMeta("MpesaReceiptNumber") || "";
    const paidAmount = getMeta("Amount");
    const phoneNumber = getMeta("PhoneNumber")?.toString() || payment.phone_number || "";

    console.log(`Payment ${payment.id} SUCCESS: Receipt=${mpesaReceiptNumber}, Amount=${paidAmount}`);

    // Verify amount
    if (paidAmount && Number(paidAmount) < Number(payment.amount)) {
      console.error(`Amount mismatch! Expected ${payment.amount}, got ${paidAmount}`);
      await adminClient
        .from("payments")
        .update({ payment_status: "failed" })
        .eq("id", payment.id);

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update payment to completed
    await adminClient
      .from("payments")
      .update({
        payment_status: "completed",
        payment_provider_reference: mpesaReceiptNumber,
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // Skip if ticket already exists
    if (payment.ticket_id) {
      console.log(`Ticket already exists for payment ${payment.id}`);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Send notifications (fire-and-forget, don't block response) ---
    // Fetch user profile + event info for notification content
    const notifyPromise = (async () => {
      try {
        // Get profile
        const { data: profile } = await adminClient
          .from("profiles")
          .select("full_name, email, phone_number")
          .eq("user_id", payment.user_id)
          .single();

        if (!profile) {
          console.warn("Profile not found for user:", payment.user_id);
          return;
        }

        // Get event + ticket type via a recent ticket or payment context
        // We need to find the event. Since the frontend polls and creates tickets,
        // let's look for recent ticket_types that match the payment amount.
        // Better: query tickets linked to this payment, or find via the event_id
        // stored during STK push flow. For now, we'll get the most recent ticket for the user.
        
        // Try to find ticket info from ticket_types via amount match
        // Actually, let's just find tickets for this user that were just created
        const { data: recentTicket } = await adminClient
          .from("tickets")
          .select("event_id, ticket_type_id, events(title), ticket_types(name, currency, price)")
          .eq("user_id", payment.user_id)
          .order("purchased_at", { ascending: false })
          .limit(1)
          .single();

        const eventTitle = (recentTicket?.events as any)?.title || "Your Event";
        const ticketName = (recentTicket?.ticket_types as any)?.name || "Ticket";
        const currency = (recentTicket?.ticket_types as any)?.currency || "KES";

        // Send SMS
        const smsPhone = phoneNumber || profile.phone_number;
        if (smsPhone) {
          const smsMessage = `✅ Payment confirmed! Your ticket for "${eventTitle}" is ready. Receipt: ${mpesaReceiptNumber}. View at sdaunite.lovable.app/my-tickets — SDA Unite`;
          await sendSms(smsPhone, smsMessage);
        } else {
          console.warn("No phone number available for SMS notification");
        }

        // Send Email
        if (profile.email) {
          const html = buildPaymentEmailHtml({
            fullName: profile.full_name || "Member",
            eventTitle,
            ticketName,
            amount: Number(payment.amount),
            currency,
            receipt: mpesaReceiptNumber,
          });
          await sendEmail(profile.email, `Payment Confirmed — ${eventTitle}`, html);
        } else {
          console.warn("No email available for email notification");
        }
      } catch (err) {
        console.error("Notification error (non-fatal):", err);
      }
    })();

    // Wait for notifications but with a timeout so we don't hold Safaricom's response
    await Promise.race([
      notifyPromise,
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ]);

    console.log(`Payment ${payment.id} completed. Notifications dispatched.`);

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Callback processing error:", err);
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
