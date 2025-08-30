-- Create Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  profile_picture_url TEXT,
  location TEXT,
  website TEXT,
  theme TEXT DEFAULT 'default',
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'unlisted', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create SocialLinks table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT,
  url TEXT,
  is_visible BOOLEAN DEFAULT true,
  widget_config JSONB DEFAULT '{"size": "medium", "position": {"x": 0, "y": 0}}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PaymentLinks table
CREATE TABLE IF NOT EXISTS public.payment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT,
  url TEXT NOT NULL,
  display_name TEXT,
  message TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create WidgetLayouts table for storing widget positions
CREATE TABLE IF NOT EXISTS public.widget_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  widget_id UUID,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  size TEXT DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large', 'wide')),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_layouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public profiles" ON public.profiles
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for social_links table
CREATE POLICY "Users can manage their own social links" ON public.social_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view visible social links of public profiles" ON public.social_links
  FOR SELECT USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = social_links.profile_id 
      AND profiles.privacy_level = 'public'
    )
  );

-- RLS Policies for payment_links table
CREATE POLICY "Users can manage their own payment links" ON public.payment_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = payment_links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view visible payment links of public profiles" ON public.payment_links
  FOR SELECT USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = payment_links.profile_id 
      AND profiles.privacy_level = 'public'
    )
  );

-- RLS Policies for widget_layouts table
CREATE POLICY "Users can manage their own widget layouts" ON public.widget_layouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = widget_layouts.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view widget layouts of public profiles" ON public.widget_layouts
  FOR SELECT USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = widget_layouts.profile_id 
      AND profiles.privacy_level = 'public'
    )
  );
