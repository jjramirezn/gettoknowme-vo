-- Add ENS identity column to profiles table
ALTER TABLE profiles 
ADD COLUMN ens_identity TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN profiles.ens_identity IS 'User ENS (Ethereum Name Service) identity like username.eth';
