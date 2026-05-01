
-- Fix overly permissive notifications insert policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only authenticated users or system (via service role) can insert notifications for any user
-- This is needed because notifications are created by the system when bookings are approved/rejected
CREATE POLICY "Authenticated can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
