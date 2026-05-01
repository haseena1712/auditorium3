-- Drop FK to auth.users and add FK to profiles instead
ALTER TABLE public.bookings DROP CONSTRAINT bookings_user_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
