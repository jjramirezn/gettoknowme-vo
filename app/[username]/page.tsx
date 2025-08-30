"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, LogOut, Edit3, Eye } from "lucide-react"
import { WidgetGrid } from "@/components/widget-system"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

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
  const [currentUser, setCurrentUser] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [isEditMode, setIsEditMode] = useState(searchParams.get("edit") === "true")

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setCurrentUser(authUser)

      // Check if this is the user's own profile
      const profileUsername = authUser?.user_metadata?.username || authUser?.id
      setIsOwnProfile(profileUsername === params.username)

      // If it's their own profile and edit=true in URL, enable edit mode
      if (isOwnProfile && searchParams.get("edit") === "true") {
        setIsEditMode(true)
      }
    }

    checkAuth()
  }, [params.username, searchParams, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleEditToggle = () => {
    const newEditMode = !isEditMode
    setIsEditMode(newEditMode)

    // Update URL without page reload
    const url = new URL(window.location.href)
    if (newEditMode) {
      url.searchParams.set("edit", "true")
    } else {
      url.searchParams.delete("edit")
    }
    window.history.replaceState({}, "", url.toString())
  }

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/${params.username}`
    if (navigator.share) {
      await navigator.share({
        title: `${user.displayName} - GetToKnowMe`,
        text: user.bio,
        url: profileUrl,
      })
    } else {
      await navigator.clipboard.writeText(profileUrl)
      // Could add a toast notification here
    }
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {isOwnProfile && (
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary">
                <span className="sr-only">GetToKnowMe</span>
              </div>
              <span className="font-semibold text-sm">GetToKnowMe</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-transparent"
              >
                {isEditMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditMode ? "Preview" : "Edit"}
              </Button>
              <Button size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button size="sm" variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <WidgetGrid
          accounts={user.connectedAccounts}
          profileData={profileData}
          isEditMode={isEditMode && isOwnProfile}
          onEditModeChange={setIsEditMode}
        />

        {!isOwnProfile && (
          <div className="text-center mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">GetToKnowMe</span> • Create your own profile
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
