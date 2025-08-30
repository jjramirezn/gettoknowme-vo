"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
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
  MapPin,
  Calendar,
  Users,
  Plus,
  EyeOff,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Widget size configurations
const WIDGET_SIZES = {
  small: { width: 1, height: 1, minWidth: 280, minHeight: 200 },
  medium: { width: 2, height: 1, minWidth: 300, minHeight: 250 },
  large: { width: 2, height: 2, minWidth: 300, minHeight: 400 },
  wide: { width: 3, height: 1, minWidth: 400, minHeight: 200 },
}

const WIDGET_TYPES = {
  profile: { name: "Profile", icon: "👤", minWidth: 280, minHeight: 200 },
  instagram: { name: "Instagram", icon: "📷", minWidth: 280, minHeight: 200 },
  twitter: { name: "Twitter", icon: "🐦", minWidth: 280, minHeight: 200 },
  youtube: { name: "YouTube", icon: "📺", minWidth: 280, minHeight: 200 },
  github: { name: "GitHub", icon: "💻", minWidth: 280, minHeight: 200 },
  linkedin: { name: "LinkedIn", icon: "💼", minWidth: 280, minHeight: 200 },
  calendly: { name: "Calendly", icon: "📅", minWidth: 280, minHeight: 200 },
  ens: { name: "ENS Identity", icon: "🔗", minWidth: 280, minHeight: 200 },
  cafecito: { name: "Cafecito", icon: "☕", minWidth: 200, minHeight: 80, maxWidth: 300, maxHeight: 120 }, // Button-only widget
}

interface WidgetConfig {
  id: string
  type: "social" | "profile" | "service"
  platform?: string
  dimensions: { width: number; height: number }
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
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  account?: SocialAccount
  profileData?: ProfileData
}

function isResizeHandleClick(offsetX: number, offsetY: number, elementWidth: number, elementHeight: number): boolean {
  const handleSize = 16 // Size of the resize handle area
  return offsetX >= elementWidth - handleSize && offsetY >= elementHeight - handleSize
}

function ProfileWidget({ config, onConfigChange, isEditMode, profileData }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null)
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const minWidth = 280
  const minHeight = 200
  const maxWidth = 600
  const maxHeight = 500

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      onConfigChange(config.id, { position: config.position })

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.dimensions.width,
          height: config.dimensions.height,
        })
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [isEditMode, position, config.dimensions, config.id, onConfigChange],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !isEditMode) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (isDragging) {
          const newPosition = {
            x: Math.max(0, e.clientX - dragStart.x),
            y: Math.max(0, e.clientY - dragStart.y),
          }
          setPosition(newPosition)
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
          const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))

          setResizePreview({ width: newWidth, height: newHeight })
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart, minWidth, minHeight, maxWidth, maxHeight],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return

    setIsDragging(false)

    if (isDragging) {
      onConfigChange(config.id, { position })
    }

    if (isResizing && resizePreview) {
      onConfigChange(config.id, { dimensions: resizePreview })
      setResizePreview(null)
    }

    setIsResizing(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, resizePreview, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  useEffect(() => {
    // if (!isResizing) {
    //   setDimensions({ width: sizeConfig.minWidth, height: sizeConfig.minHeight })
    // }
  }, [config.dimensions, isResizing])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible || !profileData) return null

  const currentDimensions = resizePreview || config.dimensions

  return (
    <>
      {isResizing && resizePreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40"
          style={{
            left: position.x,
            top: position.y,
            width: resizePreview.width,
            height: resizePreview.height,
          }}
        />
      )}

      <Card
        ref={widgetRef}
        className={`absolute border-2 transition-all duration-75 ${
          isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
        } ${isEditMode ? "cursor-move" : ""} bg-card border-border ${isResizing ? "z-30" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: currentDimensions.width,
          height: currentDimensions.height,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
        }}
        onMouseDown={handleMouseDown}
      >
        <CardContent className="p-4 h-full overflow-hidden">
          {/* Widget Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm bg-primary">
                👤
              </div>
              <div>
                <h3 className="font-semibold text-sm">Profile</h3>
                <p className="text-xs text-muted-foreground">@{profileData.username}</p>
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
                    <DropdownMenuItem onClick={toggleVisibility}>
                      <Eye className="w-4 h-4 mr-2" />
                      Hide Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isEditMode && (
                <div className="cursor-move">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 h-full overflow-hidden">
            {currentDimensions.width < 350 && (
              <div className="text-center">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                />
                <h3 className="font-semibold text-sm truncate">{profileData.name}</h3>
              </div>
            )}

            {currentDimensions.width >= 350 && currentDimensions.height < 350 && (
              <div className="flex items-center gap-3">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{profileData.bio}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
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

            {currentDimensions.width >= 350 && currentDimensions.height >= 350 && (
              <div className="text-center space-y-3">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-20 h-20 rounded-full mx-auto"
                />
                <div>
                  <h3 className="font-bold text-xl mb-1">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{profileData.bio}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                      <Users className="w-4 h-4" />
                      <span className="truncate">{profileData.followers} followers</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{profileData.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isEditMode && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize transition-all duration-150 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/20 hover:bg-primary/40"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full transition-all ${
                  isResizing ? "scale-125" : ""
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function SocialWidget({ account, config, onConfigChange, isEditMode }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null)
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const minWidth = 280
  const minHeight = 200
  const maxWidth = 600
  const maxHeight = 500

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      onConfigChange(config.id, { position: config.position })

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.dimensions.width,
          height: config.dimensions.height,
        })
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [isEditMode, position, config.dimensions, config.id, onConfigChange],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !isEditMode) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (isDragging) {
          const newPosition = {
            x: Math.max(0, e.clientX - dragStart.x),
            y: Math.max(0, e.clientY - dragStart.y),
          }
          setPosition(newPosition)
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
          const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))

          setResizePreview({ width: newWidth, height: newHeight })
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart, minWidth, minHeight, maxWidth, maxHeight],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return

    setIsDragging(false)

    if (isDragging) {
      onConfigChange(config.id, { position })
    }

    if (isResizing && resizePreview) {
      onConfigChange(config.id, { dimensions: resizePreview })
      setResizePreview(null)
    }

    setIsResizing(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, resizePreview, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  const ENHANCED_MOCK_DATA = {
    Instagram: {
      recentPosts: [
        { image: "/vibrant-coastal-sunset.png", likes: "2.1K", comments: "89", caption: "Golden hour magic ✨" },
        { image: "/steaming-coffee-cup.png", likes: "1.8K", comments: "67", caption: "Monday motivation ☕" },
        { image: "/vibrant-cityscape.png", likes: "3.2K", comments: "124", caption: "City lights never get old 🌃" },
        { image: "/abstract-profile.png", likes: "1.5K", comments: "43", caption: "Behind the scenes 📸" },
        { image: "/vibrant-coastal-sunset.png", likes: "2.8K", comments: "91", caption: "Weekend vibes 🌊" },
        { image: "/steaming-coffee-cup.png", likes: "1.9K", comments: "56", caption: "Creative process ⚡" },
      ],
      stories: ["Travel", "Food", "Work", "Friends"],
      highlights: 4,
      engagement: "4.2%",
    },
    Twitter: {
      recentPosts: [
        {
          text: "Just shipped a new feature that I'm really excited about! The future of social media is here 🚀",
          likes: "847",
          comments: "23",
          retweets: "156",
        },
        {
          text: "Hot take: The best content creators are the ones who stay authentic while scaling. Quality > Quantity always.",
          likes: "1.2K",
          comments: "89",
          retweets: "234",
        },
        {
          text: "Building in public has been one of the best decisions for my career. Transparency builds trust 💯",
          likes: "923",
          comments: "45",
          retweets: "178",
        },
      ],
      trending: "#BuildInPublic",
      impressions: "125K",
    },
    YouTube: {
      recentPosts: [
        { title: "How I Built My Personal Brand in 6 Months", views: "45K", duration: "12:34", likes: "2.1K" },
        { title: "The Future of Social Media (My Predictions)", views: "78K", duration: "18:45", likes: "3.8K" },
        { title: "Day in the Life of a Content Creator", views: "32K", duration: "8:22", likes: "1.9K" },
      ],
      subscribers: "127K",
      totalViews: "2.1M",
    },
    GitHub: {
      recentRepos: [
        {
          name: "social-dashboard",
          stars: "234",
          language: "TypeScript",
          description: "Modern social media dashboard",
        },
        {
          name: "content-scheduler",
          stars: "89",
          language: "React",
          description: "AI-powered content scheduling tool",
        },
        { name: "analytics-engine", stars: "156", language: "Python", description: "Real-time social analytics" },
      ],
      contributions: "1,247",
      streak: "89 days",
    },
    LinkedIn: {
      recentPosts: [
        {
          text: "Excited to share that our team just hit 100K users! Here's what we learned about scaling...",
          likes: "456",
          comments: "67",
        },
        {
          text: "The intersection of AI and social media is fascinating. Here are 5 trends I'm watching...",
          likes: "789",
          comments: "123",
        },
      ],
      connections: "2.5K+",
      profile_views: "1.2K",
    },
  }

  const mockData = ENHANCED_MOCK_DATA[account.platform as keyof typeof ENHANCED_MOCK_DATA]
  const enhancedAccount = { ...account, recentPosts: mockData?.recentPosts || account.recentPosts }

  if (!config.visible || !account) return null

  const currentDimensions = resizePreview || config.dimensions

  return (
    <>
      {isResizing && resizePreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40"
          style={{
            left: position.x,
            top: position.y,
            width: resizePreview.width,
            height: resizePreview.height,
          }}
        />
      )}

      <Card
        ref={widgetRef}
        className={`absolute border-2 transition-all duration-150 ${
          isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
        } ${isEditMode ? "cursor-move" : ""} bg-card border-border ${isResizing ? "z-30" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: currentDimensions.width,
          height: currentDimensions.height,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
        }}
        onMouseDown={handleMouseDown}
      >
        <CardContent className="p-4 h-full overflow-hidden">
          {/* Widget Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 ${account.color} rounded-lg flex items-center justify-center text-white text-sm`}
              >
                {account.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{account.platform}</h3>
                <p className="text-xs text-muted-foreground">{account.followers} followers</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isEditMode && account.platform === "Twitter" && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Trending
                </Badge>
              )}

              {isEditMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={toggleVisibility}>
                      <Eye className="w-4 h-4 mr-2" />
                      Hide Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isEditMode && (
                <div className="cursor-move">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
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

          <div className="space-y-2 h-full overflow-hidden">
            {currentDimensions.width < 350 && (
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {account.handle}
                </Badge>
                {account.platform === "Instagram" && (
                  <div className="text-xs text-muted-foreground">4.2% engagement</div>
                )}
              </div>
            )}

            {currentDimensions.width >= 350 && currentDimensions.height < 350 && account.platform === "Instagram" && (
              <div className="space-y-2">
                <div className="flex gap-1 mb-2">
                  {mockData?.stories?.slice(0, Math.floor(currentDimensions.width / 80)).map((story, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5"
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs">
                        {story[0]}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`grid gap-1`}
                  style={{ gridTemplateColumns: `repeat(${Math.floor(currentDimensions.width / 100)}, 1fr)` }}
                >
                  {enhancedAccount.recentPosts
                    ?.slice(0, Math.floor(currentDimensions.width / 100) * 1)
                    .map((post, index) => (
                      <div key={index} className="aspect-square relative group cursor-pointer">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <div className="flex items-center gap-1 text-white text-xs">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {currentDimensions.width >= 350 && currentDimensions.height >= 350 && account.platform === "Instagram" && (
              <div className="space-y-3">
                <div className="flex gap-2 overflow-x-auto">
                  {mockData?.stories?.slice(0, Math.floor(currentDimensions.width / 60)).map((story, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-medium">
                          {story[0]}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-12 text-center">{story}</span>
                    </div>
                  ))}
                </div>

                <div
                  className={`grid gap-2`}
                  style={{ gridTemplateColumns: `repeat(${Math.floor(currentDimensions.width / 120)}, 1fr)` }}
                >
                  {enhancedAccount.recentPosts
                    ?.slice(
                      0,
                      Math.floor(currentDimensions.width / 120) * Math.floor((currentDimensions.height - 150) / 120),
                    )
                    .map((post, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post"
                          className="w-full aspect-square object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <div className="flex items-center gap-1 text-white text-xs">
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

                {currentDimensions.height > 400 && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>4.2% engagement</span>
                    <span>{mockData?.highlights} highlights</span>
                  </div>
                )}
              </div>
            )}

            {currentDimensions.width >= 300 && account.platform === "Twitter" && (
              <div className="space-y-2">
                {enhancedAccount.recentPosts
                  ?.slice(0, Math.floor((currentDimensions.height - 100) / 120))
                  .map((post, index) => (
                    <div key={index} className="border rounded-lg p-3 text-xs bg-accent/50">
                      <p className="mb-2 leading-relaxed line-clamp-3">{post.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 opacity-70">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🔄</span>
                            {post.retweets}
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Viral
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                {currentDimensions.height > 300 && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>125K impressions</span>
                    <span>Trending: #BuildInPublic</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditMode && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize transition-all duration-150 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/20 hover:bg-primary/40"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full transition-all ${
                  isResizing ? "scale-125" : ""
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function CalendlyWidget({ config, onConfigChange, isEditMode }: WidgetProps) {
  // ... existing drag/resize logic ...
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null)
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const minWidth = 280
  const minHeight = 200
  const maxWidth = 600
  const maxHeight = 500

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.dimensions.width,
          height: config.dimensions.height,
        })
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [isEditMode, position, config.dimensions],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !isEditMode) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (isDragging) {
          const newPosition = {
            x: Math.max(0, e.clientX - dragStart.x),
            y: Math.max(0, e.clientY - dragStart.y),
          }
          setPosition(newPosition)
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
          const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))

          setResizePreview({ width: newWidth, height: newHeight })
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart, minWidth, minHeight, maxWidth, maxHeight],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return

    setIsDragging(false)

    if (isDragging) {
      onConfigChange(config.id, { position })
    }

    if (isResizing && resizePreview) {
      onConfigChange(config.id, { dimensions: resizePreview })
      setResizePreview(null)
    }

    setIsResizing(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, resizePreview, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible) return null

  const currentDimensions = resizePreview || config.dimensions

  return (
    <>
      {isResizing && resizePreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40"
          style={{
            left: position.x,
            top: position.y,
            width: resizePreview.width,
            height: resizePreview.height,
          }}
        />
      )}

      <Card
        ref={widgetRef}
        className={`absolute border-2 transition-all duration-75 ${
          isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
        } ${isEditMode ? "cursor-move" : ""} bg-card border-border ${isResizing ? "z-30" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: currentDimensions.width,
          height: currentDimensions.height,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
        }}
        onMouseDown={handleMouseDown}
      >
        <CardContent className="p-4 h-full overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                📅
              </div>
              <div>
                <h3 className="font-semibold text-sm">Calendly</h3>
                <p className="text-xs text-muted-foreground">Schedule a meeting</p>
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
                    <DropdownMenuItem onClick={toggleVisibility}>
                      <Eye className="w-4 h-4 mr-2" />
                      Hide Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isEditMode && (
                <div className="cursor-move">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
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

            {currentDimensions.height > 300 && (
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Usually responds within 2 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Available Mon-Fri, 9AM-6PM EST</span>
                </div>
              </div>
            )}
          </div>

          {isEditMode && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize transition-all duration-150 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/20 hover:bg-primary/40"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full transition-all ${
                  isResizing ? "scale-125" : ""
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function ENSWidget({ config, onConfigChange, isEditMode }: WidgetProps) {
  // ... existing drag/resize logic ...
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null)
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const minWidth = 280
  const minHeight = 200
  const maxWidth = 600
  const maxHeight = 500

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.dimensions.width,
          height: config.dimensions.height,
        })
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [isEditMode, position, config.dimensions],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !isEditMode) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (isDragging) {
          const newPosition = {
            x: Math.max(0, e.clientX - dragStart.x),
            y: Math.max(0, e.clientY - dragStart.y),
          }
          setPosition(newPosition)
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX))
          const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY))

          setResizePreview({ width: newWidth, height: newHeight })
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart, minWidth, minHeight, maxWidth, maxHeight],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return

    setIsDragging(false)

    if (isDragging) {
      onConfigChange(config.id, { position })
    }

    if (isResizing && resizePreview) {
      onConfigChange(config.id, { dimensions: resizePreview })
      setResizePreview(null)
    }

    setIsResizing(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, resizePreview, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible) return null

  const currentDimensions = resizePreview || config.dimensions

  return (
    <>
      {isResizing && resizePreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40"
          style={{
            left: position.x,
            top: position.y,
            width: resizePreview.width,
            height: resizePreview.height,
          }}
        />
      )}

      <Card
        ref={widgetRef}
        className={`absolute border-2 transition-all duration-75 ${
          isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
        } ${isEditMode ? "cursor-move" : ""} bg-card border-border ${isResizing ? "z-30" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: currentDimensions.width,
          height: currentDimensions.height,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
        }}
        onMouseDown={handleMouseDown}
      >
        <CardContent className="p-4 h-full overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                🔗
              </div>
              <div>
                <h3 className="font-semibold text-sm">ENS Identity</h3>
                <p className="text-xs text-muted-foreground">alexcreator.eth</p>
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
                    <DropdownMenuItem onClick={toggleVisibility}>
                      <Eye className="w-4 h-4 mr-2" />
                      Hide Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isEditMode && (
                <div className="cursor-move">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
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

            {currentDimensions.height > 300 && (
              <div className="space-y-2">
                <h5 className="font-semibold text-xs">Recent Activity</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Received 0.1 ETH</span>
                    <span className="text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minted NFT</span>
                    <span className="text-muted-foreground">1d ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isEditMode && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize transition-all duration-150 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/20 hover:bg-primary/40"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full transition-all ${
                  isResizing ? "scale-125" : ""
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function CafecitoWidget({ config, onConfigChange, isEditMode }: WidgetProps) {
  // ... existing drag logic (no resize for button-only widget) ...
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [isEditMode, position],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isEditMode) return

      const newPosition = {
        x: Math.max(0, e.clientX - dragStart.x),
        y: Math.max(0, e.clientY - dragStart.y),
      }
      setPosition(newPosition)
    },
    [isDragging, isEditMode, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    onConfigChange(config.id, { position })
  }, [isDragging, position, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible) return null

  return (
    <Card
      ref={widgetRef}
      className={`absolute border-2 transition-all duration-75 ${
        isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
      } ${isEditMode ? "cursor-move" : ""} bg-card border-border`}
      style={{
        left: position.x,
        top: position.y,
        width: 250,
        height: 80,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-3 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">☕</div>
          <div>
            <h3 className="font-semibold text-sm">Buy me a coffee</h3>
            <p className="text-xs text-muted-foreground">Support my work</p>
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
                <DropdownMenuItem onClick={toggleVisibility}>
                  <Eye className="w-4 h-4 mr-2" />
                  Hide Widget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isEditMode && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              ☕ $3
            </Button>
          )}

          {isEditMode && (
            <div className="cursor-move">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
    const socialConfigs = accounts.map((account, index) => ({
      id: `widget-${account.platform.toLowerCase()}`,
      type: "social" as const,
      platform: account.platform,
      dimensions: { width: 320, height: 280 },
      position: {
        x: ((index + 1) % 3) * 340 + 20,
        y: Math.floor((index + 1) / 3) * 300 + 20,
      },
      visible: true,
    }))

    const profileConfig = {
      id: "widget-profile",
      type: "profile" as const,
      dimensions: { width: 320, height: 400 },
      position: { x: 20, y: 20 },
      visible: true,
    }

    const serviceConfigs = [
      {
        id: "widget-calendly",
        type: "service" as const,
        platform: "calendly",
        dimensions: { width: 320, height: 280 },
        position: { x: 20, y: 440 },
        visible: false,
      },
      {
        id: "widget-ens",
        type: "service" as const,
        platform: "ens",
        dimensions: { width: 320, height: 280 },
        position: { x: 360, y: 440 },
        visible: false,
      },
      {
        id: "widget-cafecito",
        type: "service" as const,
        platform: "cafecito",
        dimensions: { width: 250, height: 80 },
        position: { x: 700, y: 440 },
        visible: false,
      },
    ]

    return [profileConfig, ...socialConfigs, ...serviceConfigs]
  })

  const handleConfigChange = (id: string, newConfig: Partial<WidgetConfig>) => {
    setWidgetConfigs((prev) => {
      const updatedConfigs = prev.map((config) => (config.id === id ? { ...config, ...newConfig } : config))

      // If position changed (drag/resize), move widget to end of array (front)
      if (newConfig.position || newConfig.dimensions) {
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
        type === "profile" ? "profile" : type.includes("instagram") || type.includes("twitter") ? "social" : "service",
      platform: type,
      dimensions: {
        width: WIDGET_TYPES[type as keyof typeof WIDGET_TYPES]?.minWidth || 320,
        height: WIDGET_TYPES[type as keyof typeof WIDGET_TYPES]?.minHeight || 280,
      },
      position: { x: 20, y: 20 },
      visible: true,
    }
    setWidgetConfigs((prev) => [...prev, newWidget])
  }

  const resetLayout = () => {
    setWidgetConfigs((prev) =>
      prev.map((config, index) => {
        if (config.type === "profile") {
          return {
            ...config,
            position: { x: 20, y: 20 },
            dimensions: { width: 320, height: 400 },
            visible: true,
          }
        }
        const socialIndex = index - 1
        return {
          ...config,
          position: {
            x: ((socialIndex + 1) % 3) * 340 + 20,
            y: Math.floor((socialIndex + 1) / 3) * 300 + 20,
          },
          dimensions: { width: 320, height: 280 },
          visible: true,
        }
      }),
    )
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
              const isHidden = existingWidget && !existingWidget.visible

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

      <div className="flex-1 space-y-4">
        {/* Edit Mode Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => onEditModeChange(!isEditMode)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditMode ? "Done Editing" : "Customize Layout"}
            </Button>

            {isEditMode && (
              <Button variant="outline" size="sm" onClick={resetLayout}>
                Reset Layout
              </Button>
            )}
          </div>

          {isEditMode && (
            <div className="text-sm text-muted-foreground">
              Drag widgets to reposition • Drag corners to resize • Use panel to show/hide widgets
            </div>
          )}
        </div>

        {/* Widget Container */}
        <div
          className={`relative min-h-[600px] border-2 border-dashed rounded-lg transition-all duration-200 ${
            isEditMode ? "border-primary bg-primary/5" : "border-transparent"
          }`}
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
            } else if (config.type === "service") {
              if (config.platform === "calendly") {
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
            } else {
              const account = accounts.find((a) => a.platform === config.platform)
              if (!account) return null

              return (
                <SocialWidget
                  key={config.id}
                  account={account}
                  config={config}
                  onConfigChange={handleConfigChange}
                  isEditMode={isEditMode}
                />
              )
            }
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
