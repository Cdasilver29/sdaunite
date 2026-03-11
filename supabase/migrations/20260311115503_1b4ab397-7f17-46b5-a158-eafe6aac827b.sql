
-- Create retreats table
CREATE TABLE public.retreats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  location_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Nairobi',
  country TEXT NOT NULL DEFAULT 'Kenya',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  spiritual_objective TEXT,
  starting_price NUMERIC DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  capacity INTEGER NOT NULL DEFAULT 50,
  includes_transport BOOLEAN DEFAULT false,
  includes_accommodation BOOLEAN DEFAULT true,
  includes_meals BOOLEAN DEFAULT true,
  schedule JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  retreat_status TEXT NOT NULL DEFAULT 'draft' CHECK (retreat_status IN ('draft', 'published', 'cancelled', 'completed')),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.retreats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published retreats viewable by everyone" ON public.retreats FOR SELECT TO public USING (retreat_status = 'published' OR (auth.uid() IS NOT NULL AND organizer_id = auth.uid()));
CREATE POLICY "Organizers can create retreats" ON public.retreats FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id AND (has_role(auth.uid(), 'organizer') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')));
CREATE POLICY "Organizers can update own retreats" ON public.retreats FOR UPDATE TO authenticated USING (auth.uid() = organizer_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete retreats" ON public.retreats FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Create blog_articles table
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Faith' CHECK (category IN ('Faith', 'Service', 'Retreats', 'Youth Life')),
  image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  published BOOLEAN NOT NULL DEFAULT false,
  related_event_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles viewable by everyone" ON public.blog_articles FOR SELECT TO public USING (published = true OR (auth.uid() IS NOT NULL AND author_id = auth.uid()));
CREATE POLICY "Admins can manage articles" ON public.blog_articles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Create xperience_photos table
CREATE TABLE public.xperience_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.xperience_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved photos viewable by everyone" ON public.xperience_photos FOR SELECT TO public USING (approved = true OR (auth.uid() IS NOT NULL AND (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))));
CREATE POLICY "Authenticated users can upload photos" ON public.xperience_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins can update photos" ON public.xperience_photos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete photos" ON public.xperience_photos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Create streams table
CREATE TABLE public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stream_type TEXT NOT NULL DEFAULT 'sermon' CHECK (stream_type IN ('sermon', 'seminar', 'concert', 'retreat', 'youth_program')),
  video_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  pricing_model TEXT NOT NULL DEFAULT 'free' CHECK (pricing_model IN ('free', 'pay_per_view', 'rent')),
  rent_duration_hours INTEGER DEFAULT 48,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id),
  bible_text TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  stream_status TEXT NOT NULL DEFAULT 'draft' CHECK (stream_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published streams viewable by everyone" ON public.streams FOR SELECT TO public USING ((stream_status = 'published' AND approved = true) OR (auth.uid() IS NOT NULL AND (organizer_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'))));
CREATE POLICY "Organizers can create streams" ON public.streams FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own streams" ON public.streams FOR UPDATE TO authenticated USING (auth.uid() = organizer_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete streams" ON public.streams FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Create stream_access table
CREATE TABLE public.stream_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, stream_id)
);
ALTER TABLE public.stream_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own access" ON public.stream_access FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own access" ON public.stream_access FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all access" ON public.stream_access FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('xperience-photos', 'xperience-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('retreat-images', 'retreat-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('stream-thumbnails', 'stream-thumbnails', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public read xperience photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'xperience-photos');
CREATE POLICY "Auth upload xperience photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'xperience-photos');
CREATE POLICY "Public read blog images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'blog-images');
CREATE POLICY "Auth upload blog images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "Public read retreat images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'retreat-images');
CREATE POLICY "Auth upload retreat images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'retreat-images');
CREATE POLICY "Public read stream thumbnails" ON storage.objects FOR SELECT TO public USING (bucket_id = 'stream-thumbnails');
CREATE POLICY "Auth upload stream thumbnails" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'stream-thumbnails');
