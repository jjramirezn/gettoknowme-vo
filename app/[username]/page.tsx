"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Palette } from "lucide-react"
import { WidgetGrid } from "@/components/widget-system"

// Theme configurations
const themes = {
  default: {
    colors: {
      primary: "#3B82F6",
      secondary: "#10B981",
      background: "#FFFFFF",
      foreground: "#374151",
      accent: "#F3F4F6",
    },
    gradientClass: "from-blue-500 to-blue-600",
  },
  sunset: {
    colors: {
      primary: "#F97316",
      secondary: "#EC4899",
      background: "#FFF7ED",
      foreground: "#9A3412",
      accent: "#FED7AA",
    },
    gradientClass: "from-orange-500 to-pink-500",
  },
  forest: {
    colors: {
      primary: "#059669",
      secondary: "#84CC16",
      background: "#F0FDF4",
      foreground: "#064E3B",
      accent: "#DCFCE7",
    },
    gradientClass: "from-emerald-600 to-lime-500",
  },
  midnight: {
    colors: {
      primary: "#8B5CF6",
      secondary: "#06B6D4",
      background: "#0F172A",
      foreground: "#F1F5F9",
      accent: "#1E293B",
    },
    gradientClass: "from-slate-900 to-purple-900",
  },
  coral: {
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      background: "#FFFBF7",
      foreground: "#2D3748",
      accent: "#FED7D7",
    },
    gradientClass: "from-red-400 to-teal-400",
  },
  monochrome: {
    colors: {
      primary: "#000000",
      secondary: "#6B7280",
      background: "#FFFFFF",
      foreground: "#111827",
      accent: "#F9FAFB",
    },
    gradientClass: "from-gray-900 to-gray-600",
  },
}

// Mock user data - in real app this would come from database
const mockUserData = {
  username: "alexcreator",
  displayName: "Alex Johnson",
  bio: "Digital creator, photographer, and storyteller. Sharing my journey through life, travel, and creativity. Always looking for the next adventure!",
  profileImage: "/abstract-profile.png",
  location: "San Francisco, CA",
  joinDate: "March 2024",
  followers: "12.5K",
  following: "892",
  theme: "default", // This would come from user settings
  connectedAccounts: [
    {
      platform: "Instagram",
      handle: "@alexcreator",
      followers: "8.2K",
      icon: "📷",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      url: "https://instagram.com/alexcreator",
      recentPosts: [
        { image: "/vibrant-coastal-sunset.png", likes: 234, comments: 12 },
        { image: "/steaming-coffee-cup.png", likes: 156, comments: 8 },
        { image: "/vibrant-cityscape.png", likes: 189, comments: 15 },
      ],
    },
    {
      platform: "Twitter",
      handle: "@alexcreator",
      followers: "3.1K",
      icon: "🐦",
      color: "bg-blue-500",
      url: "https://twitter.com/alexcreator",
      recentPosts: [
        { text: "Just finished an amazing photoshoot in Golden Gate Park! 📸", likes: 45, comments: 6 },
        { text: "Coffee and creativity go hand in hand ☕️✨", likes: 32, comments: 4 },
      ],
    },
    {
      platform: "YouTube",
      handle: "Alex Creator",
      followers: "1.2K",
      icon: "📺",
      color: "bg-red-500",
      url: "https://youtube.com/@alexcreator",
      recentPosts: [
        { title: "My Photography Workflow 2024", views: "2.1K", duration: "12:34" },
        { title: "Best Coffee Shops in SF", views: "1.8K", duration: "8:45" },
      ],
    },
  ],
  paymentLinks: [
    { platform: "Ko-fi", url: "https://ko-fi.com/alexcreator", icon: "☕" },
    { platform: "PayPal", url: "https://paypal.me/alexcreator", icon: "💳" },
  ],
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const user = mockUserData // In real app, fetch based on params.username
  const [currentTheme, setCurrentTheme] = useState(user.theme)
  const [isEditMode, setIsEditMode] = useState(false)

  const theme = themes[currentTheme as keyof typeof themes] || themes.default

  // Apply theme styles dynamically
  const themeStyles = {
    backgroundColor: theme.colors.background,
    color: theme.colors.foreground,
  }

  const primaryButtonStyle = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
  }

  const profileData = {
    name: user.displayName,
    username: user.username,
    bio: user.bio,
    avatar: user.profileImage,
    location: user.location,
    joinDate: user.joinDate,
    followers: user.followers,
    following: user.following,
  }

  return (
    <div className="min-h-screen" style={themeStyles}>
      {/* Header */}
      <header
        className="border-b backdrop-blur-sm sticky top-0 z-50"
        style={{ backgroundColor: `${theme.colors.background}CC`, borderColor: theme.colors.accent }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md" style={{ backgroundColor: theme.colors.primary }}>
              <span className="sr-only">GetToKnowMe</span>
            </div>
            <span className="font-semibold text-sm">GetToKnowMe</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const themeKeys = Object.keys(themes)
                const currentIndex = themeKeys.indexOf(currentTheme)
                const nextIndex = (currentIndex + 1) % themeKeys.length
                setCurrentTheme(themeKeys[nextIndex])
              }}
              className="flex items-center gap-2"
              style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
            >
              <Palette className="w-4 h-4" />
              Theme
            </Button>
            <Button size="sm" className="flex items-center gap-2" style={primaryButtonStyle}>
              <Share2 className="w-4 h-4" />
              Share Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Widget Grid with Profile Widget */}
        <WidgetGrid
          accounts={user.connectedAccounts}
          profileData={profileData}
          theme={theme}
          isEditMode={isEditMode}
          onEditModeChange={setIsEditMode}
        />

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t" style={{ borderColor: theme.colors.accent }}>
          <p className="text-sm opacity-70">
            Powered by <span className="font-semibold">GetToKnowMe</span> • Create your own profile
          </p>
        </div>
      </div>
    </div>
  )
}
