-- Create sample data for demo users to see
-- Sample data for GetToKnowMe platform
-- This creates demo profiles and social links for anonymous users to explore

-- Insert sample users (these would be created by auth, but we're adding for demo)
INSERT INTO users (id, email, username, created_at, updated_at) VALUES
  ('demo-user-1', 'alex@example.com', 'alexcreator', NOW(), NOW()),
  ('demo-user-2', 'sarah@example.com', 'sarahdesigns', NOW(), NOW()),
  ('demo-user-3', 'mike@example.com', 'mikecodes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample profiles
INSERT INTO profiles (
  user_id, 
  display_name, 
  bio, 
  profile_image_url, 
  location, 
  website_url,
  theme_preference,
  widget_layout,
  created_at, 
  updated_at
) VALUES
  (
    'demo-user-1',
    'Alex Johnson',
    'Digital creator, photographer, and storyteller. Sharing my journey through life, travel, and creativity. Always looking for the next adventure!',
    '/abstract-profile.png',
    'San Francisco, CA',
    'https://alexcreator.com',
    'default',
    '{"widgets": [{"id": "profile", "type": "profile", "size": "large", "position": {"x": 20, "y": 20}, "visible": true}]}',
    NOW(),
    NOW()
  ),
  (
    'demo-user-2',
    'Sarah Chen',
    'UI/UX Designer passionate about creating beautiful, accessible experiences. Coffee enthusiast and weekend hiker.',
    '/placeholder.svg?height=200&width=200',
    'Seattle, WA',
    'https://sarahdesigns.co',
    'sunset',
    '{"widgets": [{"id": "profile", "type": "profile", "size": "medium", "position": {"x": 20, "y": 20}, "visible": true}]}',
    NOW(),
    NOW()
  ),
  (
    'demo-user-3',
    'Mike Rodriguez',
    'Full-stack developer building the future one line of code at a time. Open source contributor and tech mentor.',
    '/placeholder.svg?height=200&width=200',
    'Austin, TX',
    'https://mikecodes.dev',
    'midnight',
    '{"widgets": [{"id": "profile", "type": "profile", "size": "wide", "position": {"x": 20, "y": 20}, "visible": true}]}',
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample social links
INSERT INTO social_links (
  user_id,
  platform,
  platform_username,
  platform_url,
  display_name,
  follower_count,
  is_verified,
  is_visible,
  sort_order,
  created_at,
  updated_at
) VALUES
  -- Alex's social links
  ('demo-user-1', 'instagram', 'alexcreator', 'https://instagram.com/alexcreator', '@alexcreator', 8200, true, true, 1, NOW(), NOW()),
  ('demo-user-1', 'twitter', 'alexcreator', 'https://twitter.com/alexcreator', '@alexcreator', 3100, false, true, 2, NOW(), NOW()),
  ('demo-user-1', 'youtube', 'alexcreator', 'https://youtube.com/@alexcreator', 'Alex Creator', 1200, false, true, 3, NOW(), NOW()),
  
  -- Sarah's social links
  ('demo-user-2', 'instagram', 'sarahdesigns', 'https://instagram.com/sarahdesigns', '@sarahdesigns', 5600, false, true, 1, NOW(), NOW()),
  ('demo-user-2', 'twitter', 'sarahdesigns', 'https://twitter.com/sarahdesigns', '@sarahdesigns', 2800, false, true, 2, NOW(), NOW()),
  ('demo-user-2', 'github', 'sarahchen', 'https://github.com/sarahchen', 'sarahchen', 890, false, true, 3, NOW(), NOW()),
  
  -- Mike's social links
  ('demo-user-3', 'github', 'mikecodes', 'https://github.com/mikecodes', 'mikecodes', 1500, true, true, 1, NOW(), NOW()),
  ('demo-user-3', 'twitter', 'mikecodes', 'https://twitter.com/mikecodes', '@mikecodes', 4200, false, true, 2, NOW(), NOW()),
  ('demo-user-3', 'instagram', 'mikecodes', 'https://instagram.com/mikecodes', '@mikecodes', 2100, false, true, 3, NOW(), NOW())
ON CONFLICT (user_id, platform) DO NOTHING;

-- Insert sample donation/payment links
INSERT INTO donation_links (
  user_id,
  platform,
  platform_url,
  display_name,
  description,
  is_visible,
  sort_order,
  created_at,
  updated_at
) VALUES
  -- Alex's payment links
  ('demo-user-1', 'kofi', 'https://ko-fi.com/alexcreator', 'Buy me a coffee', 'Support my photography work', true, 1, NOW(), NOW()),
  ('demo-user-1', 'paypal', 'https://paypal.me/alexcreator', 'PayPal', 'Direct support', true, 2, NOW(), NOW()),
  
  -- Sarah's payment links
  ('demo-user-2', 'kofi', 'https://ko-fi.com/sarahdesigns', 'Buy me a coffee', 'Support my design work', true, 1, NOW(), NOW()),
  
  -- Mike's payment links
  ('demo-user-3', 'github', 'https://github.com/sponsors/mikecodes', 'GitHub Sponsors', 'Sponsor my open source work', true, 1, NOW(), NOW()),
  ('demo-user-3', 'kofi', 'https://ko-fi.com/mikecodes', 'Buy me a coffee', 'Support my coding tutorials', true, 2, NOW(), NOW())
ON CONFLICT (user_id, platform) DO NOTHING;
