-- Fixes:
-- 1) Auth "Failed to create user: {}" / Database error creating new user
-- 2) Public enquiry + newsletter inserts blocked by RLS
--
-- Run in: Supabase Dashboard → SQL → New query → Run

-- ─── 1. Auth trigger ─────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      split_part(COALESCE(NEW.email, 'user'), '@', 1)
    ),
    NEW.email,
    'content_writer'::public.user_role,
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET email = COALESCE(EXCLUDED.email, profiles.email),
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name);

  -- Promote to super_admin only when explicitly requested in metadata
  IF (NEW.raw_user_meta_data->>'role') = 'super_admin' THEN
    UPDATE public.profiles
    SET role = 'super_admin'::public.user_role
    WHERE id = NEW.id;
  ELSIF (NEW.raw_user_meta_data->>'role') IN ('admin', 'editor', 'content_writer', 'marketing') THEN
    UPDATE public.profiles
    SET role = (NEW.raw_user_meta_data->>'role')::public.user_role
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO postgres, service_role, supabase_auth_admin;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role, supabase_auth_admin;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── 2. Public form inserts (enquiries + newsletter) ─────────────────────────

GRANT INSERT ON TABLE public.enquiries TO anon, authenticated;
GRANT INSERT ON TABLE public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON TABLE public.enquiries TO authenticated;
GRANT SELECT ON TABLE public.newsletter_subscribers TO authenticated;

DROP POLICY IF EXISTS "Anyone insert enquiries" ON public.enquiries;
CREATE POLICY "Anyone insert enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone subscribe newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone subscribe newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Staff still need elevated enquiry access (existing policies use has_permission)
