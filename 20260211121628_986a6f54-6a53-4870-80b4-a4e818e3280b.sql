-- Allow users to delete their own bookings
CREATE POLICY "Users can delete own bookings"
ON public.bookings
FOR DELETE
USING (auth.uid() = user_id);

-- Allow management/admin to delete any bookings
CREATE POLICY "Management can delete bookings"
ON public.bookings
FOR DELETE
USING (has_role(auth.uid(), 'management'::app_role) OR has_role(auth.uid(), 'admin'::app_role));