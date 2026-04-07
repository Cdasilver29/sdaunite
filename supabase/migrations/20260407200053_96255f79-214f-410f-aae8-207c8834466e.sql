
CREATE POLICY "Anyone can read camp meeting audio"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'camp-meeting-audio');

CREATE POLICY "Admins can upload camp meeting audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'camp-meeting-audio' AND (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')
));

CREATE POLICY "Admins can update camp meeting audio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'camp-meeting-audio' AND (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')
));

CREATE POLICY "Admins can delete camp meeting audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'camp-meeting-audio' AND (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')
));
