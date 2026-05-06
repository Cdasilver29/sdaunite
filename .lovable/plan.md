# Plan

## 1. Modern animated orbit UI (HeroSection)

Refresh the rotating category orbit on the homepage hero so it feels like a high-end SaaS landing. Keep the existing drag/scroll behavior and active-state highlighting — only the visuals change.

Changes in `src/components/HeroSection.tsx`:
- Replace the flat Lucide icons inside each orbit chip with **real emoji glyphs** rendered in a circular tile, paired with the existing label. Each item gets a tasteful emoji that matches its meaning:
  - Events 📅, Singles Spark 💞, Football League ⚽, Retreats 🌄, Camp Meeting ⛺, Streams 🎥, Fundraisers 🤝, Nature Hikes 🥾, Service Missions 🙌, Prayer & Worship 🙏, Music Concerts 🎶
  - Emojis are rendered inside a glassy gold-bordered tile, sized for crisp display on retina, with `aria-label` retained for accessibility.
- New visual treatment for the orbit:
  - Soft animated radial gradient halo behind the ring (slow pulse, low opacity gold).
  - Two concentric rings: outer dashed gold ring slowly counter-rotates; inner ring stays static. Adds depth without distracting.
  - Each chip becomes a frosted-glass pill (backdrop-blur, subtle inner border, soft shadow). On hover/active it lifts, tile scales 1.08, and a warm gold glow ring appears.
  - Currently active item gets a permanent gold ring + a small pulsing dot indicator.
  - Center "A" badge gets a subtle breathing animation and an orbiting micro-dot for life.
- Smoother motion: ease the auto-rotation, add a tiny inertia after drag release (already partially there), and a one-time entrance animation where chips fade/scale in along their arc on first paint.
- Mobile: keep `touch-none` so swipe rotates without scroll-jacking; replace "Drag to rotate" hint with an animated chevron arc indicator.

No new dependencies — uses existing `framer-motion` and Tailwind tokens (`--sda-warm`, etc.). Religious-modesty constraint: emojis chosen are neutral activity/object glyphs, no faces with jewelry, no crosses.

## 2. Secure emailed CSV download (replaces direct browser download)

Today `CheckIn.tsx` builds a CSV in the browser and triggers an `<a download>`. Replace with a server-side flow that emails the organizer a signed, expiring link.

### Backend

- New Edge Function `export-checkins` (`supabase/functions/export-checkins/index.ts`), `verify_jwt = false` with manual JWT validation:
  - Inputs: `event_id`, optional `ticket_type_ids: string[]`, optional `email_to` (defaults to caller's profile email).
  - Auth check: load caller from JWT. Allow only if `auth.uid() = events.organizer_id` OR caller has role `admin` / `super_admin`. Otherwise 403. (Mirrors the QR check-in access rules.)
  - Build CSV server-side using the service role:
    - Pull every ticket for the event (optionally filtered by `ticket_type_id IN (...)`).
    - Left-join with `event_checkins` (latest scan per ticket) to determine **scan outcome**:
      - `checked_in` — has a row in `event_checkins`.
      - `valid_not_scanned` — ticket_status `valid`, no check-in row.
      - `cancelled` / `refunded` — from `tickets.ticket_status`.
      - `already_checked_in_attempt` — if we add a lightweight scan-attempt log (see note below).
    - Pull profile (name, email, phone) and ticket type name.
    - Columns: `Ticket ID, Attendee Name, Email, Phone, Ticket Type, Ticket Status, Scan Outcome, Checked-in At, Scanned By`.
  - Upload CSV to a **private** Storage bucket `checkin-exports` at `event_{id}/{timestamp}_{random}.csv`.
  - Generate a Supabase **signed URL** valid for 24 hours.
  - Send email via the existing Lovable Emails infra (transactional template `checkin-export-ready`) to the recipient containing: event title, filter summary (ticket types, row count), the signed download link, and an expiry note. Link opens the CSV directly — no login required, but the URL is unguessable and short-lived.
  - Returns `{ ok: true, row_count, expires_at }`.

### Database / storage

- Migration: create private Storage bucket `checkin-exports` (no public read; only service role writes; access exclusively via signed URLs).
- Migration: enable Lovable email infra if not already (`setup_email_infra`) and scaffold a `checkin-export-ready` transactional template using `scaffold_transactional_email` (branded with deep navy + warm gold).
- No schema changes required for outcome tracking using only successful check-ins. **Optional** (recommended): add a `scan_attempts` table (`event_id, ticket_id NULL, raw_token_hash, outcome TEXT, scanned_by, created_at`) and have `verify-checkin` insert a row for every attempt (success and failure). This lets the CSV include `already_checked_in_attempt`, `bad_signature`, `wrong_event`, etc. We will add this table + RLS (organizers/admins SELECT) and update `verify-checkin` to log attempts.

### Frontend (`src/pages/admin/CheckIn.tsx`)

- Replace the inline `exportCsv` browser-download logic with a dialog: **"Email me a CSV"**.
  - Multi-select `Ticket types` (fetched from `ticket_types` for the event; "All" by default).
  - Optional override email field (prefilled with profile email).
  - Submit calls `supabase.functions.invoke("export-checkins", { body: { event_id, ticket_type_ids, email_to } })`.
  - On success: toast "Your export is on the way to {email}. The link expires in 24 hours." Close dialog.
  - The button is hidden entirely unless `canAccess` is true (existing client-side check) — the server is the source of truth.

## 3. Access hardening

- Server-side check inside `export-checkins` is the real enforcement (organizer of event OR `admin`/`super_admin`). Returns 403 for everyone else, including `organizer` role users who don't own this event.
- Storage bucket stays private; the signed URL is the only way to fetch the file.
- Email link is single-purpose: it points to the signed Storage URL, not a re-download endpoint, so revoking access = deleting the object (we can later add a TTL cleanup job).

## Technical summary

| Area | Files |
|---|---|
| Orbit visuals | `src/components/HeroSection.tsx` |
| Edge function | `supabase/functions/export-checkins/index.ts` (new); update `supabase/functions/verify-checkin/index.ts` to log scan attempts |
| Migrations | new private bucket `checkin-exports`; new `scan_attempts` table + RLS |
| Email | scaffold transactional template `checkin-export-ready` (Lovable Emails) |
| UI | `src/pages/admin/CheckIn.tsx` — replace download with email-dialog; add ticket-type multi-select |

## Open question

For the "scan outcome" column: do you want it to reflect **per-ticket final state** (one row per ticket sold, showing whether it was checked in / never scanned / cancelled), or **per-scan-attempt** (one row per scan, including failed/duplicate scans)? The plan above supports both — the per-attempt view requires the optional `scan_attempts` table. I'll default to per-ticket plus the new `scan_attempts` table so both views are possible, unless you say otherwise.
