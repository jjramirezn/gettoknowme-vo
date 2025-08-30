-- Add custom_color column to widget_layouts table to persist widget colors

-- Add custom_color column
ALTER TABLE widget_layouts 
ADD COLUMN custom_color text;

-- Add comment to explain the column
COMMENT ON COLUMN widget_layouts.custom_color IS 'Hex color code for custom widget styling (e.g., #ff5733)';
