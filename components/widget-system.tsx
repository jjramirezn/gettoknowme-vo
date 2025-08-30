"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, GripVertical, ExternalLink, Heart, MessageCircle, Eye, MapPin, Calendar, Users } from "lucide-react"
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
  type: "social" | "profile"
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
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  account?: SocialAccount
  profileData?: ProfileData
}

function ProfileWidget({ config, onConfigChange, isEditMode, profileData }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const sizeConfig = WIDGET_SIZES[config.size]

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode || isResizing) return
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [isEditMode, position, isResizing],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
    },
    [isEditMode],
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
        }
        if (isResizing) {
          const sizes = Object.keys(WIDGET_SIZES) as (keyof typeof WIDGET_SIZES)[]
          const currentIndex = sizes.indexOf(config.size)
          const nextSize = sizes[(currentIndex + 1) % sizes.length]
          onConfigChange(config.id, { size: nextSize })
          setIsResizing(false)
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, config.size, config.id, onConfigChange],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return
    setIsDragging(false)
    setIsResizing(false)
    if (isDragging) {
      onConfigChange(config.id, { position })
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible || !profileData) return null

  return (
    <Card
      ref={widgetRef}
      className={`absolute border-2 transition-all duration-150 ${
        isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
      } ${isEditMode ? "cursor-move" : ""} bg-card border-border`}
      style={{
        left: position.x,
        top: position.y,
        width: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
      }}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-4 h-full">
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm bg-primary">👤</div>
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
                <p className="text-sm text-muted-foreground mb-2">{profileData.bio}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                <p className="text-sm text-muted-foreground mb-3">{profileData.bio}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                    <Users className="w-4 h-4" />
                    <span>{profileData.followers} followers</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
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
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-primary/20 hover:bg-primary/40 transition-colors"
            style={{
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            }}
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
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
      { name: "social-dashboard", stars: "234", language: "TypeScript", description: "Modern social media dashboard" },
      { name: "content-scheduler", stars: "89", language: "React", description: "AI-powered content scheduling tool" },
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

function SocialWidget({ account, config, onConfigChange, isEditMode }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(config.position)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const sizeConfig = WIDGET_SIZES[config.size]

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode || isResizing) return
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [isEditMode, position, isResizing],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
    },
    [isEditMode],
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
        }
        if (isResizing) {
          const sizes = Object.keys(WIDGET_SIZES) as (keyof typeof WIDGET_SIZES)[]
          const currentIndex = sizes.indexOf(config.size)
          const nextSize = sizes[(currentIndex + 1) % sizes.length]
          onConfigChange(config.id, { size: nextSize })
          setIsResizing(false)
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, config.size, config.id, onConfigChange],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return
    setIsDragging(false)
    setIsResizing(false)
    if (isDragging) {
      onConfigChange(config.id, { position })
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, position, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  const mockData = ENHANCED_MOCK_DATA[account.platform as keyof typeof ENHANCED_MOCK_DATA]
  const enhancedAccount = { ...account, recentPosts: mockData?.recentPosts || account.recentPosts }

  if (!config.visible || !account) return null

  return (
    <Card
      ref={widgetRef}
      className={`absolute border-2 transition-all duration-150 ${
        isDragging ? "shadow-2xl scale-105 z-50" : "hover:shadow-lg"
      } ${isEditMode ? "cursor-move" : ""} bg-card border-border`}
      style={{
        left: position.x,
        top: position.y,
        width: sizeConfig.minWidth,
        minHeight: sizeConfig.minHeight,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
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

        {/* Widget Content */}
        <div className="space-y-2">
          {config.size === "small" && (
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-xs">
                {account.handle}
              </Badge>
              {account.platform === "Instagram" && <div className="text-xs text-muted-foreground">4.2% engagement</div>}
            </div>
          )}

          {(config.size === "medium" || config.size === "wide") && account.platform === "Instagram" && (
            <div className="space-y-2">
              <div className="flex gap-1 mb-2">
                {mockData?.stories?.slice(0, 4).map((story, index) => (
                  <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs">
                      {story[0]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {enhancedAccount.recentPosts?.slice(0, 3).map((post, index) => (
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

          {config.size === "large" && account.platform === "Instagram" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {mockData?.stories?.map((story, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-medium">
                        {story[0]}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground truncate w-12 text-center">{story}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {enhancedAccount.recentPosts?.slice(0, 6).map((post, index) => (
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

              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>4.2% engagement</span>
                <span>{mockData?.highlights} highlights</span>
              </div>
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "Twitter" && (
            <div className="space-y-2">
              {enhancedAccount.recentPosts?.slice(0, config.size === "large" ? 3 : 2).map((post, index) => (
                <div key={index} className="border rounded-lg p-3 text-xs bg-accent/50">
                  <p className="mb-2 leading-relaxed">{post.text}</p>
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

              {config.size === "large" && (
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>125K impressions</span>
                  <span>Trending: #BuildInPublic</span>
                </div>
              )}
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "YouTube" && (
            <div className="space-y-2">
              {config.size === "large" && (
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-xs font-medium">🎉 127K Subscribers!</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                    +2.1K this month
                  </Badge>
                </div>
              )}

              {enhancedAccount.recentPosts?.slice(0, config.size === "large" ? 3 : 2).map((post, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border rounded-lg p-2 bg-accent/50 hover:bg-accent/70 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-16 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-center text-white text-xs font-medium">
                      ▶
                    </div>
                    <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-1 rounded">
                      {post.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{post.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.views} views</span>
                      <span>•</span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "GitHub" && (
            <div className="space-y-2">
              {config.size === "large" && (
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="text-xs font-medium">🔥 89 day streak</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    1,247 contributions
                  </Badge>
                </div>
              )}

              {mockData?.recentRepos?.slice(0, config.size === "large" ? 3 : 2).map((repo, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 bg-accent/50 hover:bg-accent/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-600">📁 {repo.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>⭐</span>
                      <span>{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{repo.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {repo.language}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {(config.size === "medium" || config.size === "large") && account.platform === "LinkedIn" && (
            <div className="space-y-2">
              {mockData?.recentPosts?.slice(0, config.size === "large" ? 2 : 1).map((post, index) => (
                <div key={index} className="border rounded-lg p-3 text-xs bg-blue-50">
                  <p className="mb-2 leading-relaxed">{post.text}</p>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>👍</span>
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              ))}

              {config.size === "large" && (
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>2.5K+ connections</span>
                  <span>1.2K profile views</span>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditMode && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-primary/20 hover:bg-primary/40 transition-colors"
            style={{
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            }}
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full" />
          </div>
        )}
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
        const socialIndex = index - 1
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
          <Button variant={isEditMode ? "default" : "outline"} size="sm" onClick={() => onEditModeChange(!isEditMode)}>
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
            Drag widgets to reposition • Click settings to resize or hide
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
              <p className="text-sm">Use the settings menu to show widgets</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
