import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(
      auth.replace("Bearer ", ""),
    );
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const body = await req.json();
    const token: string = body?.token ?? "";
    const expectedEventId: string | undefined = body?.event_id;
    const dryRun: boolean = !!body?.dry_run;

    const [ticketId, sig] = token.split(".");
    if (!ticketId || !sig) {
      return new Response(
        JSON.stringify({ ok: false, reason: "invalid_token" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: ticket } = await admin
      .from("tickets")
      .select(
        "id, event_id, user_id, ticket_status, ticket_type_id",
      )
      .eq("id", ticketId)
      .maybeSingle();

    if (!ticket) {
      return new Response(
        JSON.stringify({ ok: false, reason: "not_found" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Authorization: only event organizer or admin/super_admin
    const { data: event } = await admin
      .from("events")
      .select("id, title, organizer_id, checkin_secret")
      .eq("id", ticket.event_id)
      .single();
    if (!event) {
      return new Response(
        JSON.stringify({ ok: false, reason: "event_missing" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    const { data: isSuper } = await admin.rpc("has_role", {
      _user_id: userId,
      _role: "super_admin",
    });
    const isOrganizer = event.organizer_id === userId;
    if (!isOrganizer && !isAdmin && !isSuper) {
      return new Response(
        JSON.stringify({ ok: false, reason: "forbidden" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (expectedEventId && expectedEventId !== ticket.event_id) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: "wrong_event",
          event_title: event.title,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verify signature
    const expectedSig = await hmacHex(event.checkin_secret, ticket.id);
    if (!timingSafeEq(expectedSig, sig)) {
      return new Response(
        JSON.stringify({ ok: false, reason: "bad_signature" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (ticket.ticket_status === "cancelled" || ticket.ticket_status === "refunded") {
      return new Response(
        JSON.stringify({ ok: false, reason: "ticket_invalid", status: ticket.ticket_status }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Already checked in?
    const { data: existing } = await admin
      .from("event_checkins")
      .select("id, scanned_at")
      .eq("ticket_id", ticket.id)
      .maybeSingle();

    // Fetch attendee profile for display
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", ticket.user_id)
      .maybeSingle();

    const { data: ttype } = await admin
      .from("ticket_types")
      .select("name")
      .eq("id", ticket.ticket_type_id)
      .maybeSingle();

    const baseInfo = {
      ticket_id: ticket.id,
      event_id: ticket.event_id,
      attendee_name: profile?.full_name ?? null,
      attendee_email: profile?.email ?? null,
      ticket_type: ttype?.name ?? null,
    };

    if (existing) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: "already_checked_in",
          scanned_at: existing.scanned_at,
          ...baseInfo,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (dryRun) {
      return new Response(
        JSON.stringify({ ok: true, dry_run: true, ...baseInfo }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error: insertErr } = await admin.from("event_checkins").insert({
      ticket_id: ticket.id,
      event_id: ticket.event_id,
      scanned_by_user_id: userId,
    });
    if (insertErr) {
      // race: already inserted
      if (insertErr.code === "23505") {
        return new Response(
          JSON.stringify({
            ok: false,
            reason: "already_checked_in",
            ...baseInfo,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw insertErr;
    }

    await admin
      .from("tickets")
      .update({ ticket_status: "checked_in" })
      .eq("id", ticket.id);

    return new Response(
      JSON.stringify({ ok: true, ...baseInfo, scanned_at: new Date().toISOString() }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
