
-- Camp meeting schedules table
CREATE TABLE public.camp_meeting_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended')),
  stream_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Camp meeting tracks table
CREATE TABLE public.camp_meeting_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '0:00',
  category TEXT NOT NULL DEFAULT 'Hymns',
  year TEXT NOT NULL DEFAULT '2026',
  audio_url TEXT,
  cover_image_url TEXT,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.camp_meeting_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_meeting_tracks ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "Schedules viewable by everyone" ON public.camp_meeting_schedules FOR SELECT TO public USING (true);
CREATE POLICY "Tracks viewable by everyone" ON public.camp_meeting_tracks FOR SELECT TO public USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage schedules" ON public.camp_meeting_schedules FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage tracks" ON public.camp_meeting_tracks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Seed schedule data
INSERT INTO public.camp_meeting_schedules (time, title, speaker, status) VALUES
  ('6:00 AM', 'Morning Devotion & Hymns', 'Pastor James Mwangi', 'upcoming'),
  ('9:00 AM', 'Main Worship Service', 'Elder Sarah Wanjiku', 'live'),
  ('11:30 AM', 'Youth Praise Session', 'SDA Unite Worship Team', 'upcoming'),
  ('2:00 PM', 'Afternoon Seminars', 'Dr. Peter Ochieng', 'upcoming'),
  ('5:00 PM', 'Vespers & Evening Praise', 'Camp Meeting Choir', 'upcoming'),
  ('7:00 PM', 'Evening Revival Service', 'Pastor Grace Njeri', 'upcoming');

-- Seed tracks data
INSERT INTO public.camp_meeting_tracks (title, artist, duration, category, year) VALUES
  ('Great Is Thy Faithfulness', 'Camp Meeting Choir 2025', '5:23', 'Hymns', '2025'),
  ('How Great Thou Art', 'Elder David Kimani', '4:47', 'Hymns', '2025'),
  ('It Is Well With My Soul', 'Youth Worship Band', '6:12', 'Hymns', '2025'),
  ('A Mighty Fortress Is Our God', 'Nairobi SDA Chorale', '4:58', 'Hymns', '2024'),
  ('Sabbath Morning Worship Medley', 'Camp Meeting Orchestra', '12:34', 'Worship', '2024'),
  ('Soon and Very Soon', 'Combined Camp Choir', '5:01', 'Advent Hope', '2024'),
  ('We Have This Hope', 'East Africa Division Choir', '4:22', 'Advent Hope', '2023'),
  ('Blessed Assurance', 'Karen SDA Youth', '5:45', 'Hymns', '2023'),
  ('Morning Devotion – Day 3 Full', 'Pastor John Odhiambo', '42:10', 'Sermons', '2024'),
  ('The Three Angels Message in Song', 'Camp Meeting Ensemble', '8:15', 'Worship', '2023');

-- Storage bucket for camp meeting audio
INSERT INTO storage.buckets (id, name, public) VALUES ('camp-meeting-audio', 'camp-meeting-audio', true)
ON CONFLICT (id) DO NOTHING;
