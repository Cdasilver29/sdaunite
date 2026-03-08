
-- ============================================
-- SDA UNITE — FULL DATABASE SCHEMA
-- ============================================

-- ENUMS
CREATE TYPE public.app_role AS ENUM ('user', 'organizer', 'admin');
CREATE TYPE public.event_category AS ENUM (
  'Social & Fellowship', 'Outdoor & Nature', 'Spiritual Retreats',
  'Service & Mission', 'Sports & Health', 'Music & Worship', 'Fundraisers'
);
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE public.ticket_status AS ENUM ('valid', 'cancelled', 'refunded', 'checked_in');
CREATE TYPE public.payment_method AS ENUM ('mpesa', 'card');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.registration_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE public.attendance_status AS ENUM ('registered', 'attended', 'no_show');
CREATE TYPE public.volunteer_role AS ENUM ('mentor', 'helper', 'logistics', 'coordinator');
CREATE TYPE public.gender_type AS ENUM ('male', 'female');

-- UTILITY
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- USER ROLES (must come first for has_role)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CHURCHES
CREATE TABLE public.churches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_name TEXT NOT NULL, conference TEXT, city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Kenya', address TEXT,
  verified_status BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Churches are viewable by everyone" ON public.churches FOR SELECT USING (true);
CREATE POLICY "Admins can manage churches" ON public.churches FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL, email TEXT, phone_number TEXT,
  gender gender_type, age_group TEXT,
  church_id UUID REFERENCES public.churches(id),
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- MINISTRY DEPARTMENTS
CREATE TABLE public.ministry_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_name TEXT NOT NULL UNIQUE, description TEXT
);
ALTER TABLE public.ministry_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are viewable by everyone" ON public.ministry_departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.ministry_departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- EVENTS
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, subtitle TEXT, description TEXT NOT NULL,
  event_category event_category NOT NULL,
  ministry_department_id UUID REFERENCES public.ministry_departments(id),
  church_id UUID REFERENCES public.churches(id),
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  location_name TEXT NOT NULL, city TEXT NOT NULL DEFAULT 'Nairobi',
  country TEXT NOT NULL DEFAULT 'Kenya',
  start_datetime TIMESTAMPTZ NOT NULL, end_datetime TIMESTAMPTZ NOT NULL,
  event_capacity INTEGER NOT NULL DEFAULT 100,
  event_status event_status NOT NULL DEFAULT 'draft',
  ministry_focus TEXT, bible_verse TEXT, bible_reference TEXT,
  image_url TEXT, verified BOOLEAN NOT NULL DEFAULT false, age_group TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events viewable by everyone" ON public.events FOR SELECT
  USING (event_status = 'published' OR (auth.uid() IS NOT NULL AND organizer_id = auth.uid()));
CREATE POLICY "Organizers can create events" ON public.events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = organizer_id AND (public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Organizers can update own events" ON public.events FOR UPDATE TO authenticated
  USING (auth.uid() = organizer_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_events_category ON public.events(event_category);
CREATE INDEX idx_events_city_date ON public.events(city, start_datetime);
CREATE INDEX idx_events_status ON public.events(event_status);
CREATE INDEX idx_events_church ON public.events(church_id);

-- TICKET TYPES
CREATE TABLE public.ticket_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0, currency TEXT NOT NULL DEFAULT 'KES',
  quantity_available INTEGER NOT NULL DEFAULT 100,
  sales_start_date TIMESTAMPTZ, sales_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ticket types viewable by everyone" ON public.ticket_types FOR SELECT USING (true);
CREATE POLICY "Organizers can manage ticket types" ON public.ticket_types FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- TICKETS (purchased)
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_type_id UUID REFERENCES public.ticket_types(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  ticket_status ticket_status NOT NULL DEFAULT 'valid',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Organizers can view event tickets" ON public.tickets FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can purchase tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_tickets_qr ON public.tickets(qr_code);
CREATE INDEX idx_tickets_user ON public.tickets(user_id);
CREATE INDEX idx_tickets_event ON public.tickets(event_id);

-- PAYMENTS
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id),
  payment_method payment_method NOT NULL,
  payment_provider_reference TEXT, amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  payment_status payment_status NOT NULL DEFAULT 'pending', paid_at TIMESTAMPTZ
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Organizers can view event payments" ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tickets t JOIN public.events e ON e.id = t.event_id WHERE t.id = ticket_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Payment status updates" ON public.payments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_payments_provider_ref ON public.payments(payment_provider_reference);
CREATE INDEX idx_payments_user ON public.payments(user_id);

-- TEAMS
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL, church_id UUID REFERENCES public.churches(id),
  captain_user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (auth.uid() = captain_user_id);
CREATE POLICY "Captains can update teams" ON public.teams FOR UPDATE TO authenticated USING (auth.uid() = captain_user_id);

-- TEAM MEMBERS
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL, position TEXT,
  UNIQUE (team_id, user_id)
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Captains can manage members" ON public.team_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.captain_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.captain_user_id = auth.uid()));

-- TEAM EVENT REGISTRATIONS
CREATE TABLE public.team_event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  registration_status registration_status NOT NULL DEFAULT 'pending',
  payment_id UUID REFERENCES public.payments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, event_id)
);
ALTER TABLE public.team_event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team regs viewable by participants" ON public.team_event_registrations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.captain_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Captains can register teams" ON public.team_event_registrations FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.captain_user_id = auth.uid()));

-- VOLUNTEER REGISTRATIONS
CREATE TABLE public.volunteer_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  volunteer_role volunteer_role NOT NULL DEFAULT 'helper',
  attendance_status attendance_status NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own volunteer signups" ON public.volunteer_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Organizers can view volunteers" ON public.volunteer_registrations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can volunteer" ON public.volunteer_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update volunteer status" ON public.volunteer_registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- EVENT CHECKINS
CREATE TABLE public.event_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  scanned_by_user_id UUID REFERENCES auth.users(id),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.event_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers can manage checkins" ON public.event_checkins FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Users can view own checkins" ON public.event_checkins FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));

-- EVENT REVIEWS
CREATE TABLE public.event_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  spiritual_impact_comment TEXT, fellowship_experience_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.event_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.event_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update reviews" ON public.event_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- EVENT ANALYTICS
CREATE TABLE public.event_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tickets_sold INTEGER NOT NULL DEFAULT 0, total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  attendance_count INTEGER NOT NULL DEFAULT 0, volunteer_count INTEGER NOT NULL DEFAULT 0,
  average_rating NUMERIC(3,2), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics viewable by organizers" ON public.event_analytics FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE TRIGGER update_event_analytics_updated_at BEFORE UPDATE ON public.event_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED MINISTRY DEPARTMENTS
INSERT INTO public.ministry_departments (department_name, description) VALUES
  ('Youth', 'Youth Ministries department for ages 16-35'),
  ('Singles Ministry', 'Ministry for single Adventists seeking fellowship'),
  ('Family Life', 'Supporting Adventist families'),
  ('Adventist Men', 'Ministry for men in the church'),
  ('Adventist Women', 'Ministry for women in the church'),
  ('Health & Temperance', 'Promoting healthy living'),
  ('Community Services', 'Outreach and service to the community'),
  ('Music Ministry', 'Worship through music and song'),
  ('Pathfinders', 'Youth scouting and leadership development');
