-- Add platform column to widget_layouts table to store the specific platform (instagram, twitter, etc.)
ALTER TABLE widget_layouts ADD COLUMN platform text;

-- Update existing records to set platform based on widget_type for social widgets
UPDATE widget_layouts 
SET platform = widget_type 
WHERE widget_type IN ('instagram', 'twitter', 'youtube', 'github', 'linkedin', 'calendly', 'ens', 'cafecito');

-- For generic 'social' type widgets, we'll need to handle them in the application
UPDATE widget_layouts 
SET platform = 'instagram' 
WHERE widget_type = 'social' AND platform IS NULL;
