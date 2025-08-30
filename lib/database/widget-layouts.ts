import { createClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"
import type { WidgetConfig } from "@/components/widget-base"

export interface WidgetLayoutDB {
  id: string
  profile_id: string
  widget_id: string
  widget_type: string
  position_x: number
  position_y: number
  size: string
  is_visible: boolean
  created_at: string
  updated_at: string
}

// Convert database format to widget config format
export function dbToWidgetConfig(dbLayout: WidgetLayoutDB, platform?: string): WidgetConfig {
  const [width, height] = dbLayout.size.split("x").map(Number)

  return {
    id: dbLayout.widget_id,
    type: dbLayout.widget_type as "profile" | "social" | "service",
    platform: platform || dbLayout.widget_type,
    gridPosition: { x: dbLayout.position_x, y: dbLayout.position_y },
    gridSize: { width, height },
    visible: dbLayout.is_visible,
  }
}

// Convert widget config to database format
export function widgetConfigToDb(
  config: WidgetConfig,
  profileId: string,
): Omit<WidgetLayoutDB, "id" | "created_at" | "updated_at"> {
  return {
    profile_id: profileId,
    widget_id: config.id,
    widget_type: config.type,
    position_x: config.gridPosition.x,
    position_y: config.gridPosition.y,
    size: `${config.gridSize.width}x${config.gridSize.height}`,
    is_visible: config.visible,
  }
}

// Client-side functions
export async function getWidgetLayouts(profileId: string): Promise<WidgetConfig[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("widget_layouts")
    .select("*")
    .eq("profile_id", profileId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching widget layouts:", error)
    return []
  }

  return data.map((layout) => {
    return dbToWidgetConfig(layout, layout.widget_type)
  })
}

export async function saveWidgetLayout(config: WidgetConfig, profileId: string): Promise<boolean> {
  const supabase = createClient()

  const dbData = widgetConfigToDb(config, profileId)

  const { error } = await supabase.from("widget_layouts").upsert({
    ...dbData,
    id: config.id, // Use widget ID as primary key for upsert
  })

  if (error) {
    console.error("Error saving widget layout:", error)
    return false
  }

  return true
}

export async function deleteWidgetLayout(widgetId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("widget_layouts").delete().eq("widget_id", widgetId)

  if (error) {
    console.error("Error deleting widget layout:", error)
    return false
  }

  return true
}

// Server-side functions
export async function getWidgetLayoutsServer(profileId: string): Promise<WidgetConfig[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("widget_layouts")
    .select("*")
    .eq("profile_id", profileId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching widget layouts:", error)
    return []
  }

  return data.map((layout) => {
    return dbToWidgetConfig(layout, layout.widget_type)
  })
}
