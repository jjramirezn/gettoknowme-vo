-- Update widget_layouts table to support grid-based sizing
-- Remove the old size constraint and add width/height columns

-- Drop the existing size constraint
ALTER TABLE public.widget_layouts DROP CONSTRAINT IF EXISTS widget_layouts_size_check;

-- Add new columns for grid-based sizing
ALTER TABLE public.widget_layouts 
ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 2;

-- Update existing records to have default grid sizes
UPDATE public.widget_layouts 
SET 
  width = CASE 
    WHEN size = 'small' THEN 1
    WHEN size = 'medium' THEN 2
    WHEN size = 'large' THEN 3
    WHEN size = 'wide' THEN 2
    ELSE 2
  END,
  height = CASE 
    WHEN size = 'small' THEN 1
    WHEN size = 'medium' THEN 2
    WHEN size = 'large' THEN 3
    WHEN size = 'wide' THEN 1
    ELSE 2
  END
WHERE width IS NULL OR height IS NULL;

-- Make the new columns NOT NULL after setting default values
ALTER TABLE public.widget_layouts 
ALTER COLUMN width SET NOT NULL,
ALTER COLUMN height SET NOT NULL;

-- Add constraints to ensure reasonable grid sizes
ALTER TABLE public.widget_layouts 
ADD CONSTRAINT widget_layouts_width_check CHECK (width >= 1 AND width <= 6),
ADD CONSTRAINT widget_layouts_height_check CHECK (height >= 1 AND height <= 6);

-- The size column can now be dropped or kept for backward compatibility
-- For now, we'll keep it but make it nullable since we're using width/height
ALTER TABLE public.widget_layouts ALTER COLUMN size DROP NOT NULL;
