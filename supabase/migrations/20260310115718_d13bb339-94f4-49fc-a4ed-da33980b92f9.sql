
-- Add church_admin to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'church_admin';

-- Update the has_role function to work with the new role (no changes needed, it's generic)

-- SQL snippet to make a user admin (run manually with your user's email):
-- UPDATE public.user_roles SET role = 'admin' WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
-- Or insert if they only have 'user':
-- INSERT INTO public.user_roles (user_id, role) VALUES ((SELECT id FROM auth.users WHERE email = 'your-email@example.com'), 'admin');
