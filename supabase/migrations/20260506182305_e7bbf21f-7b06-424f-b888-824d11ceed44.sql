
INSERT INTO storage.buckets (id, name, public)
VALUES ('checkin-exports', 'checkin-exports', false)
ON CONFLICT (id) DO NOTHING;
