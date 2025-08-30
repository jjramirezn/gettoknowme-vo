"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  GripVertical,
  ExternalLink,
  Heart,
  MessageCircle,
  Eye,
  Maximize2,
  MapPin,
  Calendar,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Widget size configurations
const WIDGET_SIZES = {
  small: { width: 1, height: 1, minWidth: 280, minHeight: 200 },
  medium: { width: 2, height: 1, minWidth: 300, minHeight: 250 },
  large: { width: 2, height: 2, minWidth: 300, minHeight: 400 },
  wide: { width: 3, height: 1, minWidth: 400, minHeight: 200 },
}

interface WidgetConfig {
  id: string
  type: "social" | "profile" // Added widget type to distinguish between social and profile widgets
  platform?: string
  size: keyof typeof WIDGET_SIZES
  position: { x: number; y: number }
  visible: boolean
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

interface WidgetProps {
  config: WidgetConfig
  theme: any
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  account?: SocialAccount // Made account optional since profile widget doesn't need it
  profileData?: ProfileData // Added profile data for profile widget
}

function ProfileWidget({ config, theme, onConfigChange, isEditMode, profileData }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)

  const sizeConfig = WIDGET_SIZES[config.size]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isEditMode) return
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }
    setPosition(newPosition)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    onConfigChange(config.id, { position })
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, position])

  const toggleSize = () => {
    const sizes = Object.keys(WIDGET_SIZES) as (keyof typeof WIDGET_SIZES)[]
    const currentIndex = sizes.indexOf(config.size)
    const nextSize = sizes[(currentIndex + 1) % sizes.length]
    onConfigChange(config.id, { size: nextSize })
  }

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible || !profileData) return null

  return (
    <Card
      ref={widgetRef}
      className={`absolute border-2 transition-all duration-200 ${
        isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
      } ${isEditMode ? "cursor-move" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.background,
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-4 h-full">
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              👤
            </div>
            <div>
              <h3 className="font-semibold text-sm">Profile</h3>
              <p className="text-xs opacity-70">@{profileData.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isEditMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleSize}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Resize ({config.size})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleVisibility}>
                    <Eye className="w-4 h-4 mr-2" />
                    Hide Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isEditMode && (
              <div className="cursor-move">
                <GripVertical className="w-4 h-4 opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-3">
          {config.size === "small" && (
            <div className="text-center">
              <img
                src={profileData.avatar || "/placeholder.svg"}
                alt={profileData.name}
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
              <h3 className="font-semibold text-sm">{profileData.name}</h3>
            </div>
          )}

          {(config.size === "medium" || config.size === "wide") && (
            <div className="flex items-center gap-3">
              <img
                src={profileData.avatar || "/placeholder.svg"}
                alt={profileData.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{profileData.name}</h3>
                <p className="text-sm opacity-70 mb-2">{profileData.bio}</p>
                <div className="flex items-center gap-4 text-xs opacity-60">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {profileData.followers}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profileData.location}
                  </div>
                </div>
              </div>
            </div>
          )}

          {config.size === "large" && (
            <div className="text-center space-y-3">
              <img
                src={profileData.avatar || "/placeholder.svg"}
                alt={profileData.name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <div>
                <h3 className="font-bold text-xl mb-1">{profileData.name}</h3>
                <p className="text-sm opacity-70 mb-3">{profileData.bio}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div
                    className="flex items-center justify-center gap-2 p-2 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  >
                    <Users className="w-4 h-4" />
                    <span>{profileData.followers} followers</span>
                  </div>
                  <div
                    className="flex items-center justify-center gap-2 p-2 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs opacity-60">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SocialWidget({ account, config, theme, onConfigChange, isEditMode }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)

  const sizeConfig = WIDGET_SIZES[config.size]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isEditMode) return
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }
    setPosition(newPosition)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    onConfigChange(config.id, { position })
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, position])

  const toggleSize = () => {
    const sizes = Object.keys(WIDGET_SIZES) as (keyof typeof WIDGET_SIZES)[]
    const currentIndex = sizes.indexOf(config.size)
    const nextSize = sizes[(currentIndex + 1) % sizes.length]
    onConfigChange(config.id, { size: nextSize })
  }

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible || !account) return null

  return (
    <Card
      ref={widgetRef}
      className={`absolute border-2 transition-all duration-200 ${
        isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
      } ${isEditMode ? "cursor-move" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        borderColor: theme.colors.accent,
        backgroundColor: theme.colors.background,
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-4 h-full">
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${account.color} rounded-lg flex items-center justify-center text-white text-sm`}>
              {account.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{account.platform}</h3>
              <p className="text-xs opacity-70">{account.followers} followers</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isEditMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleSize}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Resize ({config.size})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleVisibility}>
                    <Eye className="w-4 h-4 mr-2" />
                    Hide Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isEditMode && (
              <div className="cursor-move">
                <GripVertical className="w-4 h-4 opacity-50" />
              </div>
            )}

            {!isEditMode && (
              <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                <a href={account.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Widget Content */}
        <div className="space-y-2">
          {config.size === "small" && (
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                {account.handle}
              </Badge>
            </div>
          )}

          {(config.size === "medium" || config.size === "wide") && account.platform === "Instagram" && (
            <div className="grid grid-cols-3 gap-1">
              {account.recentPosts?.slice(0, 3).map((post, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          {config.size === "large" && account.platform === "Instagram" && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {account.recentPosts?.slice(0, 6).map((post, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post"
                      className="w-full aspect-square object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "Twitter" && (
            <div className="space-y-2">
              {account.recentPosts?.slice(0, config.size === "large" ? 3 : 2).map((post, index) => (
                <div
                  key={index}
                  className="border rounded p-2 text-xs"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <p className="mb-1">{post.text}</p>
                  <div className="flex items-center gap-3 opacity-70">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "YouTube" && (
            <div className="space-y-2">
              {account.recentPosts?.slice(0, config.size === "large" ? 3 : 2).map((post, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded p-2"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <div
                    className="w-12 h-8 rounded flex items-center justify-center text-xs"
                    style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
                  >
                    {post.duration}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{post.title}</p>
                    <p className="text-xs opacity-70">{post.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface WidgetGridProps {
  accounts: SocialAccount[]
  profileData: ProfileData // Added profileData prop
  theme: any
  isEditMode: boolean
  onEditModeChange: (editMode: boolean) => void
}

export function WidgetGrid({ accounts, profileData, theme, isEditMode, onEditModeChange }: WidgetGridProps) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const socialConfigs = accounts.map((account, index) => ({
      id: `widget-${account.platform.toLowerCase()}`,
      type: "social" as const,
      platform: account.platform,
      size: "medium" as keyof typeof WIDGET_SIZES,
      position: {
        x: ((index + 1) % 3) * 320 + 20,
        y: Math.floor((index + 1) / 3) * 280 + 20,
      },
      visible: true,
    }))

    const profileConfig = {
      id: "widget-profile",
      type: "profile" as const,
      size: "large" as keyof typeof WIDGET_SIZES,
      position: { x: 20, y: 20 },
      visible: true,
    }

    return [profileConfig, ...socialConfigs]
  })

  const handleConfigChange = (id: string, newConfig: Partial<WidgetConfig>) => {
    setWidgetConfigs((prev) => prev.map((config) => (config.id === id ? { ...config, ...newConfig } : config)))
  }

  const resetLayout = () => {
    setWidgetConfigs((prev) =>
      prev.map((config, index) => {
        if (config.type === "profile") {
          return {
            ...config,
            position: { x: 20, y: 20 },
            size: "large" as keyof typeof WIDGET_SIZES,
            visible: true,
          }
        }
        const socialIndex = index - 1 // Account for profile widget being first
        return {
          ...config,
          position: {
            x: ((socialIndex + 1) % 3) * 320 + 20,
            y: Math.floor((socialIndex + 1) / 3) * 280 + 20,
          },
          size: "medium" as keyof typeof WIDGET_SIZES,
          visible: true,
        }
      }),
    )
  }

  return (
    <div className="space-y-4">
      {/* Edit Mode Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => onEditModeChange(!isEditMode)}
            style={
              isEditMode
                ? { backgroundColor: theme.colors.primary, color: theme.colors.background }
                : { borderColor: theme.colors.primary, color: theme.colors.primary }
            }
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditMode ? "Done Editing" : "Customize Layout"}
          </Button>

          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetLayout}
              style={{ borderColor: theme.colors.secondary, color: theme.colors.secondary }}
            >
              Reset Layout
            </Button>
          )}
        </div>

        {isEditMode && (
          <div className="text-sm opacity-70">Drag widgets to reposition • Click settings to resize or hide</div>
        )}
      </div>

      {/* Widget Container */}
      <div
        className="relative min-h-[600px] border-2 border-dashed rounded-lg"
        style={{
          borderColor: isEditMode ? theme.colors.primary : "transparent",
          backgroundColor: isEditMode ? `${theme.colors.accent}50` : "transparent",
        }}
      >
        {widgetConfigs.map((config) => {
          if (config.type === "profile") {
            return (
              <ProfileWidget
                key={config.id}
                config={config}
                theme={theme}
                onConfigChange={handleConfigChange}
                isEditMode={isEditMode}
                profileData={profileData}
              />
            )
          } else {
            const account = accounts.find((a) => a.platform === config.platform)
            if (!account) return null

            return (
              <SocialWidget
                key={config.id}
                account={account}
                config={config}
                theme={theme}
                onConfigChange={handleConfigChange}
                isEditMode={isEditMode}
              />
            )
          }
        })}

        {isEditMode && widgetConfigs.filter((c) => c.visible).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-50">
              <p>No visible widgets</p>
              <p className="text-sm">Use the settings menu to show widgets</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
