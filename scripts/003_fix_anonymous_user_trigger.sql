-- Update users table to allow NULL email for anonymous users
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;

-- Update the trigger function to handle anonymous users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Handle anonymous users by checking if email is null
  -- Insert into users table with proper handling for anonymous users
  INSERT INTO public.users (id, username, email)
  VALUES (
    NEW.id,
    CASE 
      -- If it's an anonymous user (no email), generate username from user ID
      WHEN NEW.email IS NULL THEN 'anon_' || SUBSTRING(NEW.id::text, 1, 8)
      -- If user has metadata username, use it
      WHEN NEW.raw_user_meta_data ->> 'username' IS NOT NULL THEN NEW.raw_user_meta_data ->> 'username'
      -- Otherwise use email prefix
      ELSE SPLIT_PART(NEW.email, '@', 1)
    END,
    NEW.email -- This can be NULL for anonymous users now
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

-- The trigger itself doesn't need to be recreated as it references the function
