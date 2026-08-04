-- Fix Auth signup: broken handle_new_user trigger (Database error creating new user)
-- Run in Supabase Dashboard → SQL Editor if Auth still cannot create users.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

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
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), ''),
    NEW.email,
    CASE
      WHEN (NEW.raw_user_meta_data->>'role') IN (
        'super_admin', 'admin', 'editor', 'content_writer', 'marketing'
      ) THEN (NEW.raw_user_meta_data->>'role')::public.user_role
      ELSE 'content_writer'::public.user_role
    END,
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Staff write access for translation / junction tables (missing from initial migration)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'destination_translations','hotel_translations','experience_translations',
    'collection_translations','itinerary_translations','itinerary_days',
    'itinerary_day_translations','itinerary_destinations','destination_itineraries',
    'destination_hotels','destination_experiences','blog_post_translations',
    'blog_authors','blog_categories','blog_category_translations',
    'testimonial_translations','faq_translations','navigation_item_translations',
    'page_translations','collection_items','media_translations',
    'destination_gallery','hotel_gallery','experience_gallery'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff manage %s" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "Staff manage %s" ON %I FOR ALL USING (has_permission(''content'',''edit'') OR has_permission(''blog'',''manage'') OR has_permission(''settings'',''manage'')) WITH CHECK (has_permission(''content'',''edit'') OR has_permission(''blog'',''manage'') OR has_permission(''settings'',''manage'') OR has_permission(''content'',''create''))',
      t, t
    );
  END LOOP;
END $$;
