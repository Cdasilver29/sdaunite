
CREATE TABLE public.camp_meeting_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  phone_number TEXT,
  donor_name TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  mpesa_receipt TEXT,
  mpesa_checkout_request_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.camp_meeting_donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all donations"
ON public.camp_meeting_donations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can view own donations"
ON public.camp_meeting_donations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create donations"
ON public.camp_meeting_donations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update donations"
ON public.camp_meeting_donations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TRIGGER update_camp_meeting_donations_updated_at
BEFORE UPDATE ON public.camp_meeting_donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
