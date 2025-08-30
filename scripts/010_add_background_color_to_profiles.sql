-- Add background_color column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#f8fafc';

-- Update existing profiles to have a default background color
UPDATE profiles SET background_color = '#f8fafc' WHERE background_color IS NULL;
