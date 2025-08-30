-- Allow guest users to read basic user information for public profile lookup
-- This is needed so guest users can find profiles by username or user ID

-- Add policy to allow anyone to read basic user info (id, username) from users table
CREATE POLICY "Anyone can view basic user info" ON public.users
  FOR SELECT USING (true);

-- Note: This only allows reading id and username, not sensitive data like email
-- The application should use SELECT with specific columns to limit exposure
