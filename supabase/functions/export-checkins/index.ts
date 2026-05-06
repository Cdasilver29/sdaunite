// Generate a check-in CSV export, upload to private storage, email a signed link.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const csvEscape = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ ok: false, reason: "unauthorized" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) return json({ ok: false, reason: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const eventId: string | undefined = body?.event_id;
    const ticketTypeIds: string[] | undefined = Array.isArray(body?.ticket_type_ids)
      ? body.ticket_type_ids.filter((x: unknown) => typeof x === "string")
      : undefined;
    const emailTo: string | undefined =
      typeof body?.email_to === "string" && body.email_to.trim()
        ? body.email_to.trim()
        : undefined;

    if (!eventId) return json({ ok: false, reason: "missing_event_id" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Authorize: organizer OR admin/super_admin
    const { data: event, error: evErr } = await admin
      .from("events")
      .select("id, title, organizer_id, start_datetime")
      .eq("id", eventId)
      .single();
    if (evErr || !event) return json({ ok: false, reason: "event_not_found" }, 404);

    const { data: rolesRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const roles = (rolesRows ?? []).map((r) => r.role);
    const isAdmin = roles.includes("admin") || roles.includes("super_admin");
    const isOwner = event.organizer_id === user.id;
    if (!isOwner && !isAdmin) return json({ ok: false, reason: "forbidden" }, 403);

    // Pull tickets (optionally filtered by ticket types)
    let ticketsQuery = admin
      .from("tickets")
      .select("id, user_id, ticket_type_id, ticket_status, purchased_at")
      .eq("event_id", eventId);
    if (ticketTypeIds && ticketTypeIds.length > 0) {
      ticketsQuery = ticketsQuery.in("ticket_type_id", ticketTypeIds);
    }
    const { data: tickets, error: tErr } = await ticketsQuery;
    if (tErr) throw tErr;

    if (!tickets || tickets.length === 0) {
      return json({ ok: false, reason: "no_tickets" }, 400);
    }

    const ticketIds = tickets.map((t) => t.id);
    const userIds = Array.from(new Set(tickets.map((t) => t.user_id)));
    const typeIds = Array.from(
      new Set(tickets.map((t) => t.ticket_type_id).filter(Boolean) as string[]),
    );

    const [{ data: checkins }, { data: profiles }, { data: types }] = await Promise.all([
      admin
        .from("event_checkins")
        .select("ticket_id, scanned_at, scanned_by_user_id")
        .eq("event_id", eventId)
        .in("ticket_id", ticketIds),
      userIds.length
        ? admin
            .from("profiles")
            .select("user_id, full_name, email, phone_number")
            .in("user_id", userIds)
        : Promise.resolve({ data: [] as any[] }),
      typeIds.length
        ? admin.from("ticket_types").select("id, name").in("id", typeIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const checkinMap = new Map<string, { scanned_at: string; scanned_by_user_id: string | null }>();
    for (const c of checkins ?? []) {
      const prev = checkinMap.get(c.ticket_id);
      if (!prev || new Date(c.scanned_at) > new Date(prev.scanned_at)) {
        checkinMap.set(c.ticket_id, {
          scanned_at: c.scanned_at,
          scanned_by_user_id: c.scanned_by_user_id,
        });
      }
    }
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
    const typeMap = new Map((types ?? []).map((t: any) => [t.id, t]));

    // Resolve scanner names
    const scannerIds = Array.from(
      new Set(
        Array.from(checkinMap.values())
          .map((c) => c.scanned_by_user_id)
          .filter(Boolean) as string[],
      ),
    );
    const { data: scannerProfiles } = scannerIds.length
      ? await admin
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", scannerIds)
      : { data: [] as any[] };
    const scannerMap = new Map((scannerProfiles ?? []).map((p: any) => [p.user_id, p]));

    const headers = [
      "Ticket ID",
      "Attendee Name",
      "Email",
      "Phone",
      "Ticket Type",
      "Ticket Status",
      "Scan Outcome",
      "Checked-in At",
      "Scanned By",
    ];

    let validNotScanned = 0;
    let checkedIn = 0;
    let invalid = 0;

    const rows = tickets.map((t) => {
      const p = profileMap.get(t.user_id);
      const ty = t.ticket_type_id ? typeMap.get(t.ticket_type_id) : null;
      const ci = checkinMap.get(t.id);

      let outcome: string;
      if (ci) {
        outcome = "checked_in";
        checkedIn++;
      } else if (t.ticket_status === "valid") {
        outcome = "valid_not_scanned";
        validNotScanned++;
      } else {
        outcome = `invalid_${t.ticket_status}`;
        invalid++;
      }

      const scanner = ci?.scanned_by_user_id
        ? scannerMap.get(ci.scanned_by_user_id)
        : null;

      return [
        t.id,
        p?.full_name ?? "",
        p?.email ?? "",
        p?.phone_number ?? "",
        ty?.name ?? "",
        t.ticket_status,
        outcome,
        ci ? new Date(ci.scanned_at).toISOString() : "",
        scanner?.full_name ?? scanner?.email ?? "",
      ]
        .map(csvEscape)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeTitle = event.title.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60);
    const path = `event_${eventId}/${stamp}_${crypto.randomUUID()}_${safeTitle}.csv`;

    const { error: upErr } = await admin.storage
      .from("checkin-exports")
      .upload(path, blob, { contentType: "text/csv; charset=utf-8", upsert: false });
    if (upErr) throw upErr;

    const expiresIn = 60 * 60 * 24; // 24h
    const { data: signed, error: signErr } = await admin.storage
      .from("checkin-exports")
      .createSignedUrl(path, expiresIn);
    if (signErr || !signed) throw signErr ?? new Error("sign_failed");

    const downloadUrl = signed.signedUrl;
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Recipient
    const { data: ownProfile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    const recipient = emailTo || ownProfile?.email || user.email;
    if (!recipient) {
      return json({ ok: false, reason: "no_recipient_email" }, 400);
    }

    // Email via Resend if configured; otherwise return URL directly
    let emailSent = false;
    if (RESEND_API_KEY) {
      const filterLine =
        ticketTypeIds && ticketTypeIds.length > 0
          ? `Filtered by ${ticketTypeIds.length} ticket type(s).`
          : "All ticket types included.";

      const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#0f172a;padding:24px;">
<div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;padding:28px;">
<h1 style="margin:0 0 8px;font-size:20px;color:#003B5C;">Your check-in export is ready</h1>
<p style="margin:0 0 16px;color:#475569;">${csvEscape(event.title)}</p>
<p style="margin:0 0 8px;font-size:14px;">${tickets.length} ticket(s) · ${checkedIn} checked in · ${validNotScanned} not scanned · ${invalid} invalid. ${filterLine}</p>
<p style="margin:24px 0;"><a href="${downloadUrl}" style="background:#EAB57E;color:#0f172a;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px;display:inline-block;">Download CSV</a></p>
<p style="margin:0;color:#64748b;font-size:12px;">This secure link expires in 24 hours. Do not share it.</p>
</div></body></html>`;

      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Adventist Unite <onboarding@resend.dev>",
          to: [recipient],
          subject: `Check-in export: ${event.title}`,
          html,
        }),
      });
      emailSent = resp.ok;
      if (!resp.ok) {
        console.error("resend_error", await resp.text());
      }
    }

    return json({
      ok: true,
      row_count: tickets.length,
      checked_in: checkedIn,
      valid_not_scanned: validNotScanned,
      invalid,
      email_sent: emailSent,
      recipient,
      expires_at: expiresAt,
      // Returned as a fallback so the UI can show/copy the link if email failed.
      download_url: emailSent ? null : downloadUrl,
    });
  } catch (e) {
    console.error(e);
    return json({ ok: false, reason: "server_error", message: String((e as any)?.message ?? e) }, 500);
  }
});
