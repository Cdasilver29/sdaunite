
-- Create a system/seed user in auth.users for seeding purposes
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'seed@sdaunite.org',
  crypt('SeedUser2026!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create profile for seed user
INSERT INTO public.profiles (user_id, full_name, email)
VALUES ('a0000000-0000-0000-0000-000000000001', 'SDA Unite Team', 'seed@sdaunite.org')
ON CONFLICT DO NOTHING;

-- Give seed user organizer role
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000001', 'organizer')
ON CONFLICT DO NOTHING;

-- Seed 8 published events
INSERT INTO public.events (title, subtitle, description, event_category, organizer_id, location_name, city, country, church_id, start_datetime, end_datetime, event_capacity, event_status, ministry_focus, bible_verse, bible_reference, verified, age_group)
VALUES
  ('Nairobi Youth Fellowship Picnic', 'A day of games, praise & bonding', 'Join fellow SDA youth for a fun-filled outdoor picnic at Uhuru Gardens. Expect praise songs, team games, a devotional, and great food.', 'Social & Fellowship', 'a0000000-0000-0000-0000-000000000001', 'Uhuru Gardens', 'Nairobi', 'Kenya', '46ebf39e-bf85-497a-a958-8b03dacd51ee', '2026-04-12 09:00:00+03', '2026-04-12 17:00:00+03', 150, 'published', 'Youth Ministries', 'Iron sharpens iron, and one man sharpens another.', 'Proverbs 27:17', true, '18-30'),
  ('Mt. Longonot Sabbath Hike', 'Summit & sunset vespers at the peak', 'Experience Gods creation on a breathtaking hike up Mt. Longonot. Start early, summit by noon, close with sunset vespers.', 'Outdoor & Nature', 'a0000000-0000-0000-0000-000000000001', 'Mt. Longonot National Park', 'Naivasha', 'Kenya', '16f593d6-29f7-48d8-a499-ff4dd2291139', '2026-04-19 06:00:00+03', '2026-04-19 19:00:00+03', 80, 'published', 'AY Ministries', 'The heavens declare the glory of God; the skies proclaim the work of his hands.', 'Psalm 19:1', true, '18-35'),
  ('Karen Prayer & Worship Night', NULL, 'A powerful evening of intercessory prayer and contemporary worship. Come as you are and leave renewed.', 'Music & Worship', 'a0000000-0000-0000-0000-000000000001', 'Karen SDA Church Hall', 'Nairobi', 'Kenya', 'e4ede4f2-20b7-4bd6-957d-e4a8585f6dd9', '2026-04-05 18:00:00+03', '2026-04-05 21:00:00+03', 200, 'published', 'Prayer Ministry', 'Draw near to God, and he will draw near to you.', 'James 4:8', true, NULL),
  ('Community Health & Fitness Day', 'Free BMI checks, fitness classes & cooking demos', 'Free health screenings, group fitness sessions, and plant-based cooking demonstrations by local health professionals.', 'Sports & Health', 'a0000000-0000-0000-0000-000000000001', 'Nairobi Central SDA Grounds', 'Nairobi', 'Kenya', 'c2461b2c-917e-467a-aa53-8f0ca7530bd0', '2026-05-03 08:00:00+03', '2026-05-03 14:00:00+03', 300, 'published', 'Health Ministries', 'Do you not know that your bodies are temples of the Holy Spirit?', '1 Corinthians 6:19', false, NULL),
  ('Kibera Outreach & Service Mission', 'Serving the least of these', 'Join 50+ volunteers for a day of community service in Kibera distributing supplies, tutoring children, and sharing hope.', 'Service & Mission', 'a0000000-0000-0000-0000-000000000001', 'Kibera Community Centre', 'Nairobi', 'Kenya', '6c057ec1-ded7-425a-bd7e-8d0daf269075', '2026-04-26 07:30:00+03', '2026-04-26 16:00:00+03', 60, 'published', 'Community Services', 'Whatever you did for one of the least of these, you did for me.', 'Matthew 25:40', true, NULL),
  ('SDA Singles Mingle & Bible Study', 'Faith, friendship & fellowship for singles', 'A relaxed evening for SDA singles to connect over interactive Bible study, icebreakers, and dinner.', 'Social & Fellowship', 'a0000000-0000-0000-0000-000000000001', 'Westlands SDA Church', 'Nairobi', 'Kenya', '883b1102-ed4d-4cb5-88cf-2f31d827af2a', '2026-05-10 16:00:00+03', '2026-05-10 20:00:00+03', 100, 'published', 'Singles Ministry', 'Two are better than one, because they have a good return for their labor.', 'Ecclesiastes 4:9', false, '25-40'),
  ('Spiritual Retreat: Renewed in Christ', '3-day lakeside retreat at Naivasha', 'Escape the city for a transformative weekend retreat. Includes seminars, nature walks, campfire worship, and baptism service.', 'Spiritual Retreats', 'a0000000-0000-0000-0000-000000000001', 'Naivasha Retreat Centre', 'Naivasha', 'Kenya', 'a83c4a5f-908a-41b9-8a14-aab55a1d7200', '2026-05-22 14:00:00+03', '2026-05-25 12:00:00+03', 120, 'published', 'Pastoral Ministry', 'Come to me, all you who are weary and burdened, and I will give you rest.', 'Matthew 11:28', true, '18-40'),
  ('SDA Schools Fundraiser Gala', 'Supporting Adventist education in Kenya', 'An elegant evening gala to raise funds for SDA schools. Features live music, guest speakers, and a silent auction.', 'Fundraisers', 'a0000000-0000-0000-0000-000000000001', 'Hilton Hotel Nairobi', 'Nairobi', 'Kenya', 'c2461b2c-917e-467a-aa53-8f0ca7530bd0', '2026-06-07 18:00:00+03', '2026-06-07 22:00:00+03', 250, 'published', 'Education Ministry', 'Train up a child in the way he should go; even when he is old he will not depart from it.', 'Proverbs 22:6', false, NULL);

-- Add ticket types for each seeded event
DO $$
DECLARE
  eid uuid;
BEGIN
  -- Picnic
  SELECT id INTO eid FROM public.events WHERE title = 'Nairobi Youth Fellowship Picnic' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Free Entry', 0, 100, 'General admission'),
    (eid, 'Early Bird', 500, 50, 'Includes lunch pack');

  -- Hike
  SELECT id INTO eid FROM public.events WHERE title = 'Mt. Longonot Sabbath Hike' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Standard', 1500, 60, 'Includes park entry & transport'),
    (eid, 'Premium', 2500, 20, 'Includes meals & park entry');

  -- Worship
  SELECT id INTO eid FROM public.events WHERE title = 'Karen Prayer & Worship Night' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Free Entry', 0, 200, 'Open to all');

  -- Health
  SELECT id INTO eid FROM public.events WHERE title = 'Community Health & Fitness Day' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Free Entry', 0, 300, 'Free health screening day');

  -- Kibera
  SELECT id INTO eid FROM public.events WHERE title = 'Kibera Outreach & Service Mission' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Volunteer Pass', 0, 60, 'Register as a volunteer');

  -- Singles
  SELECT id INTO eid FROM public.events WHERE title = 'SDA Singles Mingle & Bible Study' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Dinner & Study', 800, 80, 'Includes dinner and materials'),
    (eid, 'Study Only', 300, 20, 'Bible study session only');

  -- Retreat
  SELECT id INTO eid FROM public.events WHERE title = 'Spiritual Retreat: Renewed in Christ' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Full Retreat', 8500, 100, '3 nights, meals & activities'),
    (eid, 'Day Pass', 3000, 20, 'Single day attendance');

  -- Gala
  SELECT id INTO eid FROM public.events WHERE title = 'SDA Schools Fundraiser Gala' LIMIT 1;
  INSERT INTO public.ticket_types (event_id, name, price, quantity_available, description) VALUES
    (eid, 'Standard Table', 5000, 200, 'Dinner and entertainment'),
    (eid, 'VIP Table', 15000, 50, 'Front row, premium dinner');
END $$;
