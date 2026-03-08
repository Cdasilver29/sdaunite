/**
 * M-Pesa Callback Webhook
 * ========================
 * 
 * ARCHITECTURE:
 * Safaricom → this webhook → DB update → ticket issuance
 * 
 * This is called by Safaricom after the user approves/rejects the STK Push.
 * It is a PUBLIC endpoint (no JWT required) — Safaricom can't send auth headers.
 * 
 * SECURITY:
 * - Idempotent: duplicate callbacks are safely ignored
 * - Only processes payments in "pending" status
 * - Validates required callback fields exist
 * - Uses service role key for DB operations
 * 
 * CALLBACK PAYLOAD STRUCTURE (from Safaricom):
 * {
 *   Body: {
 *     stkCallback: {
 *       MerchantRequestID: "...",
 *       CheckoutRequestID: "...",  // Our matching key
 *       ResultCode: 0,             // 0 = success, anything else = failure
 *       ResultDesc: "...",
 *       CallbackMetadata: {
 *         Item: [
 *           { Name: "Amount", Value: 1 },
 *           { Name: "MpesaReceiptNumber", Value: "QKJ3K7L5RR" },
 *           { Name: "TransactionDate", Value: 20240101120000 },
 *           { Name: "PhoneNumber", Value: 254712345678 }
 *         ]
 *       }
 *     }
 *   }
 * }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // CORS preflight (shouldn't be needed for Safaricom but good practice)
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

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    } = callback;

    if (!CheckoutRequestID) {
      console.error("Missing CheckoutRequestID");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Connect to DB with service role ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // --- Find the matching payment ---
    const { data: payment, error: findErr } = await adminClient
      .from("payments")
      .select("id, user_id, payment_status, ticket_id, amount")
      .eq("mpesa_checkout_request_id", CheckoutRequestID)
      .single();

    if (findErr || !payment) {
      console.error("Payment not found for CheckoutRequestID:", CheckoutRequestID);
      // Still return 200 to Safaricom so they don't retry indefinitely
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Idempotency: skip if already processed ---
    if (payment.payment_status !== "pending") {
      console.log(`Payment ${payment.id} already processed (status: ${payment.payment_status}). Skipping.`);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Handle failed payment ---
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

    // --- Extract metadata from successful payment ---
    const metadata = callback.CallbackMetadata?.Item || [];
    const getMeta = (name: string) => metadata.find((m: any) => m.Name === name)?.Value;

    const mpesaReceiptNumber = getMeta("MpesaReceiptNumber") || "";
    const paidAmount = getMeta("Amount");
    const phoneNumber = getMeta("PhoneNumber")?.toString() || "";

    console.log(`Payment ${payment.id} SUCCESS: Receipt=${mpesaReceiptNumber}, Amount=${paidAmount}`);

    // --- Verify amount matches (basic fraud check) ---
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

    // --- Update payment to completed ---
    await adminClient
      .from("payments")
      .update({
        payment_status: "completed",
        payment_provider_reference: mpesaReceiptNumber,
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // --- Issue ticket ---
    // Find which ticket_type and event this payment is for
    // We need to look up via the payment's context. Since payment doesn't directly 
    // store event_id/ticket_type_id, we stored them during STK push.
    // For now, we'll look for an un-ticketed payment and match via a separate lookup.
    
    // First check if ticket already exists (idempotency)
    if (payment.ticket_id) {
      console.log(`Ticket already exists for payment ${payment.id}`);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up the pending ticket info from a separate table or from the payment reference
    // Since our current schema tracks this through the ticket creation flow,
    // the frontend will handle ticket creation after polling confirms payment.
    // 
    // ALTERNATIVE: We could create the ticket here. For maximum reliability,
    // let's do it here so the ticket is guaranteed even if user closes browser.
    
    // We'll need event_id and ticket_type_id. Let's store these in payment_provider_reference
    // Actually, let's query pending_ticket_requests or use a convention.
    // For now, the frontend polls payment status and creates the ticket.
    // This is documented as a known limitation — see SECTION 7 notes.

    console.log(`Payment ${payment.id} completed. Frontend will issue ticket on poll.`);

    // Always respond 200 to Safaricom
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Callback processing error:", err);
    // Still return 200 — don't let Safaricom retry on our errors
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
