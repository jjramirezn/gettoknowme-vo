-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, bio, profile_picture_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'bio', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'profile_picture_url', NULL)
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
