
-- Add phone_number to payments for M-Pesa
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS phone_number text;

-- Add mpesa_checkout_request_id for tracking STK push requests
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS mpesa_checkout_request_id text;
