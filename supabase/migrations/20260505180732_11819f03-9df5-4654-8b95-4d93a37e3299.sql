
-- Per-event secret used to sign ticket QR tokens
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS checkin_secret text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');

-- Prevent double check-in for a ticket
CREATE UNIQUE INDEX IF NOT EXISTS event_checkins_ticket_id_unique
  ON public.event_checkins (ticket_id);

-- Allow organizers / admins to update tickets for their events (e.g. mark checked_in)
DROP POLICY IF EXISTS "Organizers can update event tickets" ON public.tickets;
CREATE POLICY "Organizers can update event tickets"
ON public.tickets
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = tickets.event_id
      AND (
        e.organizer_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin'::app_role)
        OR public.has_role(auth.uid(), 'super_admin'::app_role)
      )
  )
);

-- Realtime for live attendance counter
ALTER TABLE public.event_checkins REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_checkins;
