-- Allow admins/management to view all profiles (for showing requester names)
CREATE POLICY "Admins and management can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'management'::app_role));
