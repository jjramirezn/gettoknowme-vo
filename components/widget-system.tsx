"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Plus, Calendar } from "lucide-react"

import { WidgetBase, type WidgetConfig } from "@/components/widget-base"
import { SocialWidget } from "@/components/widgets/social-widget"
import { getWidgetLayouts, saveWidgetLayout } from "@/lib/database/widget-layouts"

const WIDGET_TYPES = {
  profile: { name: "Profile", icon: "👤" },
  instagram: { name: "Instagram", icon: "📷" },
  twitter: { name: "Twitter", icon: "🐦" },
  youtube: { name: "YouTube", icon: "📺" },
  github: { name: "GitHub", icon: "💻" },
  linkedin: { name: "LinkedIn", icon: "💼" },
  calendly: { name: "Calendly", icon: "📅" },
  cafecito: { name: "Cafecito", icon: "☕" },
}

const WIDGET_COLORS = {
  instagram: ["#E4405F", "#833AB4", "#C13584", "#FD1D1D"],
  twitter: ["#1DA1F2", "#14171A", "#657786", "#AAB8C2"],
  youtube: ["#FF0000", "#282828", "#FFFFFF", "#FF4444"],
  github: ["#333333", "#24292E", "#F6F8FA", "#0366D6"],
  linkedin: ["#0077B5", "#00A2DC", "#313335", "#86888A"],
  calendly: ["#006BFF", "#00A2FF", "#0080FF", "#4A90E2"],
  cafecito: ["#FF6B35", "#F7931E", "#FFB74D", "#FF8A65"],
}

interface SocialAccount {
  platform: string
  handle: string
  followers: string
  icon: string
  color: string
  url: string
  recentPosts?: any[]
}

interface ProfileData {
  name: string
  username: string
  bio: string
  avatar: string
  location: string
  joinDate: string
  followers: string
  following: string
}

function CalendlyWidget({
  config,
  onConfigChange,
  isEditMode,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
}) {
  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">📅</div>
        <div>
          <h3 className="font-semibold text-sm">Calendly</h3>
          <p className="text-xs text-muted-foreground">Schedule a meeting</p>
        </div>
      </div>

      <div className="space-y-3 h-full overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="font-semibold mb-2">Book a 30-min call</h4>
          <p className="text-sm text-muted-foreground mb-4">Let's discuss your project and see how I can help</p>
          <Button className="w-full" size="sm">
            Schedule Meeting
          </Button>
        </div>
      </div>
    </WidgetBase>
  )
}

function CafecitoWidget({
  config,
  onConfigChange,
  isEditMode,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
}) {
  return (
    <WidgetBase
      config={config}
      onConfigChange={onConfigChange}
      isEditMode={isEditMode}
      className="!w-[250px] !h-[80px]"
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">☕</div>
          <div>
            <h3 className="font-semibold text-sm">Buy me a coffee</h3>
            <p className="text-xs text-muted-foreground">Support my work</p>
          </div>
        </div>
        {!isEditMode && (
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            ☕ $3
          </Button>
        )}
      </div>
    </WidgetBase>
  )
}

interface WidgetGridProps {
  accounts: SocialAccount[]
  profileData: ProfileData
  profileId: string
  isEditMode: boolean
  onEditModeChange: (editMode: boolean) => void
  onProfileUpdate?: (updates: Partial<ProfileData>) => void
  ensIdentity?: string
  onEnsUpdate?: (ens: string) => void
}

export function WidgetGrid({
  accounts,
  profileData,
  profileId,
  isEditMode,
  onEditModeChange,
  onProfileUpdate,
  ensIdentity,
  onEnsUpdate,
}: WidgetGridProps) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWidgetConfigs() {
      try {
        const configs = await getWidgetLayouts(profileId)

        if (configs.length === 0) {
          const defaultConfigs = createDefaultWidgetConfigs(accounts)
          setWidgetConfigs(defaultConfigs)

          for (const config of defaultConfigs) {
            await saveWidgetLayout(config, profileId)
          }
        } else {
          setWidgetConfigs(configs)
        }
      } catch (error) {
        console.error("Error loading widget configs:", error)
        setWidgetConfigs(createDefaultWidgetConfigs(accounts))
      } finally {
        setIsLoading(false)
      }
    }

    loadWidgetConfigs()
  }, [profileId, accounts])

  function generateUUID(): string {
    return globalThis.crypto.randomUUID()
  }

  function createDefaultWidgetConfigs(accounts: SocialAccount[]): WidgetConfig[] {
    const socialConfigs: WidgetConfig[] = accounts.map((account, index) => ({
      id: generateUUID(),
      type: account.platform === "calendly" || account.platform === "cafecito" ? "service" : "social",
      platform: account.platform,
      gridPosition: {
        x: (index % 4) * 2,
        y: Math.floor(index / 4) * 2,
      },
      gridSize: { width: account.platform === "cafecito" ? 1 : 2, height: account.platform === "cafecito" ? 1 : 2 },
      visible: true,
    }))

    return socialConfigs
  }

  const handleConfigChange = async (id: string, newConfig: Partial<WidgetConfig>) => {
    setWidgetConfigs((prev) => {
      const updatedConfigs = prev.map((config) => (config.id === id ? { ...config, ...newConfig } : config))

      if (newConfig.gridPosition || newConfig.gridSize) {
        const widgetIndex = updatedConfigs.findIndex((config) => config.id === id)
        if (widgetIndex !== -1) {
          const widget = updatedConfigs[widgetIndex]
          const otherWidgets = updatedConfigs.filter((config) => config.id !== id)
          return [...otherWidgets, widget]
        }
      }

      return updatedConfigs
    })

    const updatedWidget = widgetConfigs.find((w) => w.id === id)
    if (updatedWidget) {
      const configToSave = { ...updatedWidget, ...newConfig }
      await saveWidgetLayout(configToSave, profileId)
    }
  }

  const addWidget = async (type: string) => {
    console.log("[v0] Adding widget:", type)
    const existingWidget = widgetConfigs.find((w) => w.platform === type)
    if (existingWidget) {
      console.log("[v0] Widget already exists for platform:", type)
      return
    }

    const newWidget: WidgetConfig = {
      id: generateUUID(),
      type: type === "profile" ? "profile" : type === "calendly" || type === "cafecito" ? "service" : "social",
      platform: type,
      gridPosition: { x: 0, y: 0 },
      gridSize: { width: type === "cafecito" ? 1 : 2, height: type === "cafecito" ? 1 : 2 },
      visible: true,
    }

    setWidgetConfigs((prev) => [...prev, newWidget])
    await saveWidgetLayout(newWidget, profileId)
  }

  const createMockAccount = (platform: string): SocialAccount => {
    const mockAccounts: Record<string, SocialAccount> = {
      instagram: {
        platform: "instagram",
        handle: "@yourhandle",
        followers: "Connect to see stats",
        icon: "📷",
        color: "#E4405F",
        url: `https://instagram.com/yourhandle`,
        recentPosts: [],
      },
      twitter: {
        platform: "twitter",
        handle: "@yourhandle",
        followers: "Connect to see stats",
        icon: "🐦",
        color: "#1DA1F2",
        url: `https://twitter.com/yourhandle`,
        recentPosts: [],
      },
      youtube: {
        platform: "youtube",
        handle: "Your Channel",
        followers: "Connect to see stats",
        icon: "📺",
        color: "#FF0000",
        url: `https://youtube.com/@yourhandle`,
        recentPosts: [],
      },
      github: {
        platform: "github",
        handle: "yourhandle",
        followers: "Connect to see stats",
        icon: "💻",
        color: "#333333",
        url: `https://github.com/yourhandle`,
        recentPosts: [],
      },
      linkedin: {
        platform: "linkedin",
        handle: "Your Name",
        followers: "Connect to see stats",
        icon: "💼",
        color: "#0077B5",
        url: `https://linkedin.com/in/yourhandle`,
        recentPosts: [],
      },
    }

    return mockAccounts[platform] || mockAccounts.instagram
  }

  const handleColorChange = async (widgetId: string, color: string) => {
    await handleConfigChange(widgetId, { customColor: color })
  }

  const gridWidgets = widgetConfigs.filter((w) => w.visible)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <p>Loading widgets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={profileData.avatar || "/placeholder.svg"}
            alt={profileData.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold">{profileData.name}</h1>
            <p className="text-muted-foreground">@{profileData.username}</p>
            {isEditMode ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => onProfileUpdate?.({ bio: e.target.value })}
                placeholder="Write your bio..."
                className="text-sm text-muted-foreground mt-1 max-w-md w-full resize-none border rounded p-2 min-h-[60px]"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1 max-w-md">{profileData.bio}</p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white min-w-[200px]">
            <div className="text-center">
              {isEditMode ? (
                <div>
                  <h3 className="font-bold text-sm mb-2">ENS Identity</h3>
                  <input
                    type="text"
                    value={ensIdentity || ""}
                    onChange={(e) => onEnsUpdate?.(e.target.value)}
                    placeholder="yourname.eth"
                    className="w-full text-center bg-white/20 border border-white/30 rounded px-2 py-1 text-sm placeholder-white/70"
                  />
                </div>
              ) : (
                <h3 className="font-bold text-lg">{ensIdentity || "ENS.ETH"}</h3>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {isEditMode && (
          <div className="w-64 bg-card border rounded-lg p-4 h-fit">
            <h3 className="font-semibold mb-3">Available Widgets</h3>
            <div className="space-y-2">
              {Object.entries(WIDGET_TYPES)
                .filter(([type]) => type !== "profile")
                .map(([type, info]) => {
                  const existingWidget = widgetConfigs.find((w) => w.platform === type)

                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{info.icon}</span>
                          <span className="text-sm font-medium">{info.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {existingWidget &&
                            existingWidget.visible &&
                            WIDGET_COLORS[type as keyof typeof WIDGET_COLORS] && (
                              <div className="flex gap-1">
                                {WIDGET_COLORS[type as keyof typeof WIDGET_COLORS].map((color) => (
                                  <button
                                    key={color}
                                    className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(existingWidget.id, color)}
                                  />
                                ))}
                              </div>
                            )}

                          {existingWidget ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleConfigChange(existingWidget.id, { visible: !existingWidget.visible })
                              }
                              className="h-6 w-6 p-0"
                            >
                              {existingWidget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => addWidget(type)} className="h-6 w-6 p-0">
                              <Plus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div
            className={`relative min-h-[600px] transition-all duration-200 ${
              isEditMode ? "bg-gradient-to-br from-muted/20 to-muted/40" : ""
            }`}
            style={{
              backgroundImage: isEditMode
                ? `radial-gradient(circle at 1px 1px, rgba(var(--primary), 0.15) 1px, transparent 0)`
                : undefined,
              backgroundSize: isEditMode ? `${120 + 16}px ${120 + 16}px` : undefined,
            }}
          >
            {gridWidgets.map((config) => {
              if (config.type === "social") {
                let account = accounts.find((a) => a.platform === config.platform)
                if (!account) {
                  console.log("[v0] No real account found for", config.platform, "using mock data")
                  account = createMockAccount(config.platform)
                }

                return (
                  <SocialWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    account={account}
                    customColor={config.customColor}
                  />
                )
              } else if (config.platform === "calendly") {
                return (
                  <CalendlyWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                  />
                )
              } else if (config.platform === "cafecito") {
                return (
                  <CafecitoWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                  />
                )
              }
              return null
            })}

            {isEditMode && gridWidgets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No widgets in grid</p>
                  <p className="text-sm">Use the widget panel to add widgets</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
