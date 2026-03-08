/**
 * M-Pesa Payment Status Polling
 * ==============================
 * 
 * Frontend polls this endpoint to check if payment has been confirmed.
 * When payment is completed, this function also issues the ticket if not yet created.
 * 
 * This ensures ticket issuance even if the callback webhook has issues,
 * and provides a clean way for the frontend to get the ticket after payment.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get payment_id and ticket context from request
    const { payment_id, event_id, ticket_type_id } = await req.json();
    if (!payment_id) {
      return new Response(JSON.stringify({ error: "payment_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch payment (verify ownership)
    const { data: payment, error: payErr } = await adminClient
      .from("payments")
      .select("id, payment_status, user_id, ticket_id, payment_provider_reference")
      .eq("id", payment_id)
      .single();

    if (payErr || !payment) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payment.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If payment completed and no ticket yet, issue one
    if (payment.payment_status === "completed" && !payment.ticket_id && event_id && ticket_type_id) {
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

      if (ticketErr) {
        console.error("Ticket creation error:", ticketErr);
      } else {
        // Link ticket to payment
        await adminClient
          .from("payments")
          .update({ ticket_id: ticket.id })
          .eq("id", payment.id);

        return new Response(JSON.stringify({
          status: "completed",
          ticket_id: ticket.id,
          qr_code: qrCode,
          mpesa_receipt: payment.payment_provider_reference,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // If ticket already exists
    if (payment.ticket_id) {
      return new Response(JSON.stringify({
        status: "completed",
        ticket_id: payment.ticket_id,
        mpesa_receipt: payment.payment_provider_reference,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return current status
    return new Response(JSON.stringify({
      status: payment.payment_status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Payment status error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
