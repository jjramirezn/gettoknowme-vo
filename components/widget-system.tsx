"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Plus, Calendar } from "lucide-react"

import { WidgetBase, type WidgetConfig } from "@/components/widget-base"
import { ProfileWidget } from "@/components/widgets/profile-widget"
import { SocialWidget } from "@/components/widgets/social-widget"

const WIDGET_TYPES = {
  profile: { name: "Profile", icon: "👤" },
  instagram: { name: "Instagram", icon: "📷" },
  twitter: { name: "Twitter", icon: "🐦" },
  youtube: { name: "YouTube", icon: "📺" },
  github: { name: "GitHub", icon: "💻" },
  linkedin: { name: "LinkedIn", icon: "💼" },
  calendly: { name: "Calendly", icon: "📅" },
  ens: { name: "ENS Identity", icon: "🔗" },
  cafecito: { name: "Cafecito", icon: "☕" },
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

function ENSWidget({
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
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">🔗</div>
        <div>
          <h3 className="font-semibold text-sm">ENS Identity</h3>
          <p className="text-xs text-muted-foreground">alexcreator.eth</p>
        </div>
      </div>

      <div className="space-y-3 h-full overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">Ξ</span>
          </div>
          <h4 className="font-semibold mb-1">alexcreator.eth</h4>
          <p className="text-xs text-muted-foreground mb-3">0x742d...4f2a</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted rounded p-2">
              <div className="font-semibold">2.5 ETH</div>
              <div className="text-muted-foreground">Balance</div>
            </div>
            <div className="bg-muted rounded p-2">
              <div className="font-semibold">12</div>
              <div className="text-muted-foreground">NFTs</div>
            </div>
          </div>
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
  isEditMode: boolean
  onEditModeChange: (editMode: boolean) => void
}

export function WidgetGrid({ accounts, profileData, isEditMode, onEditModeChange }: WidgetGridProps) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const profileConfig: WidgetConfig = {
      id: "widget-profile",
      type: "profile" as const,
      gridPosition: { x: 0, y: 0 },
      gridSize: { width: 2, height: 2 },
      visible: true,
    }

    const socialConfigs: WidgetConfig[] = accounts.map((account, index) => ({
      id: `widget-${account.platform.toLowerCase()}`,
      type: "social" as const,
      platform: account.platform,
      gridPosition: {
        x: ((index + 1) % 4) * 2,
        y: Math.floor((index + 1) / 4) * 2 + 2,
      },
      gridSize: { width: 2, height: 2 },
      visible: true,
    }))

    return [profileConfig, ...socialConfigs]
  })

  const handleConfigChange = (id: string, newConfig: Partial<WidgetConfig>) => {
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
  }

  const addWidget = (type: string) => {
    const newWidget: WidgetConfig = {
      id: `widget-${type}-${Date.now()}`,
      type:
        type === "profile"
          ? "profile"
          : type === "calendly" || type === "ens" || type === "cafecito"
            ? "service"
            : "social",
      platform: type,
      gridPosition: { x: 0, y: 0 },
      gridSize: { width: type === "cafecito" ? 1 : 2, height: type === "cafecito" ? 1 : 2 },
      visible: true,
    }
    setWidgetConfigs((prev) => [...prev, newWidget])
  }

  return (
    <div className="flex gap-4">
      {isEditMode && (
        <div className="w-64 bg-card border rounded-lg p-4 h-fit">
          <h3 className="font-semibold mb-3">Available Widgets</h3>
          <div className="space-y-2">
            {Object.entries(WIDGET_TYPES).map(([type, info]) => {
              const existingWidget = widgetConfigs.find(
                (w) => w.platform === type || (type === "profile" && w.type === "profile"),
              )

              return (
                <div key={type} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{info.icon}</span>
                    <span className="text-sm font-medium">{info.name}</span>
                  </div>

                  {existingWidget ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleConfigChange(existingWidget.id, { visible: !existingWidget.visible })}
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
              )
            })}
          </div>
        </div>
      )}

      <div className="flex-1">
        <div
          className={`relative min-h-[800px] transition-all duration-200 ${
            isEditMode ? "bg-gradient-to-br from-muted/20 to-muted/40" : ""
          }`}
          style={{
            backgroundImage: isEditMode
              ? `radial-gradient(circle at 1px 1px, rgba(var(--primary), 0.15) 1px, transparent 0)`
              : undefined,
            backgroundSize: isEditMode ? `${120 + 16}px ${120 + 16}px` : undefined,
          }}
        >
          {widgetConfigs.map((config) => {
            if (config.type === "profile") {
              return (
                <ProfileWidget
                  key={config.id}
                  config={config}
                  onConfigChange={handleConfigChange}
                  isEditMode={isEditMode}
                  profileData={profileData}
                />
              )
            } else if (config.type === "social") {
              const account = accounts.find((a) => a.platform === config.platform)
              if (!account) return null

              return (
                <SocialWidget
                  key={config.id}
                  config={config}
                  onConfigChange={handleConfigChange}
                  isEditMode={isEditMode}
                  account={account}
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
            } else if (config.platform === "ens") {
              return (
                <ENSWidget
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

          {isEditMode && widgetConfigs.filter((c) => c.visible).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>No visible widgets</p>
                <p className="text-sm">Use the widget panel to add widgets</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
