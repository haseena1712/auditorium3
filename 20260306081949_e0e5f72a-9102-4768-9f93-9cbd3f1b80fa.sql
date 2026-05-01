
-- Add management can also view all feedback
CREATE POLICY "Management can view all feedback" ON public.feedback FOR SELECT TO authenticated USING (has_role(auth.uid(), 'management'::app_role));
