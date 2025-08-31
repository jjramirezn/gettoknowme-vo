-- Add integration_url column to widget_layouts table for storing integration URLs
ALTER TABLE widget_layouts 
ADD COLUMN integration_url TEXT;

-- Add comment for the new column
COMMENT ON COLUMN widget_layouts.integration_url IS 'URL for integrated widgets like Calendly, Cafecito, etc.';
