"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Share2, LogOut, Edit3, Eye } from "lucide-react"
import { WidgetGrid } from "@/components/widget-system"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const [userData, setUserData] = useState(null)
  const [socialAccounts, setSocialAccounts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ensIdentity, setEnsIdentity] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = useMemo(() => createClient(), [])

  const [isEditMode, setIsEditMode] = useState(searchParams.get("edit") === "true")

  const editFromParams = useMemo(() => searchParams.get("edit") === "true", [searchParams])

  const loadProfileData = useCallback(async () => {
    setIsLoading(true)

    try {
      console.log("[v0] Loading profile for:", params.username)

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setCurrentUser(authUser)
      console.log("[v0] Auth user:", authUser ? "authenticated" : "guest")

      if (authUser) {
        const { data: userProfile } = await supabase.from("users").select("username").eq("id", authUser.id).single()

        if (!userProfile?.username) {
          console.log("[v0] New user without username, redirecting to setup")
          router.push("/username-setup")
          return
        }
      }

      let profileData = null
      const socialLinksData = []

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.username)
      console.log("[v0] Is UUID:", isUUID, "Parameter:", params.username)

      if (authUser) {
        const { data: userProfile } = await supabase.from("users").select("username").eq("id", authUser.id).single()
        console.log("[v0] Current user profile:", userProfile)

        const isOwn = isUUID ? authUser.id === params.username : userProfile?.username === params.username
        setIsOwnProfile(isOwn)
        console.log("[v0] Is own profile:", isOwn)

        if (isOwn) {
          let { data: profile } = await supabase.from("profiles").select("*").eq("user_id", authUser.id).single()
          console.log("[v0] Own profile data:", profile)

          if (!profile) {
            console.log("[v0] Creating new profile for user:", authUser.id)
            const { data: newProfile, error } = await supabase
              .from("profiles")
              .insert({
                user_id: authUser.id,
                username: userProfile?.username || `user_${authUser.id.slice(0, 8)}`,
                display_name: userProfile?.username || `User ${authUser.id.slice(0, 8)}`,
                bio: "Welcome to my profile!",
              })
              .select()
              .single()

            if (newProfile && !error) {
              profile = newProfile
              console.log("[v0] Created new profile:", profile)
            } else {
              console.error("[v0] Error creating profile:", error)
            }
          }

          if (profile) {
            setProfileId(profile.id)
            profileData = profile
            setEnsIdentity(profile.ens_identity || "")
          }
        }
      } else {
        setIsOwnProfile(false)
      }

      if (!profileData) {
        console.log("[v0] Looking for public profile, isUUID:", isUUID)

        let publicUser = null
        let userQuery = null

        if (isUUID) {
          console.log("[v0] Querying users by ID:", params.username)
          userQuery = await supabase.from("users").select("id, username").eq("id", params.username).single()
        } else {
          console.log("[v0] Querying users by username:", params.username)
          userQuery = await supabase.from("users").select("id, username").eq("username", params.username).single()
        }

        console.log("[v0] User query result:", userQuery)
        publicUser = userQuery.data

        if (userQuery.error) {
          console.error("[v0] Error finding user:", userQuery.error)
        }

        if (publicUser) {
          console.log("[v0] Found public user:", publicUser)
          const profileQuery = await supabase.from("profiles").select("*").eq("user_id", publicUser.id).single()
          console.log("[v0] Profile query result:", profileQuery)

          if (profileQuery.error) {
            console.error("[v0] Error finding profile:", profileQuery.error)
          }

          const profile = profileQuery.data
          console.log("[v0] Public profile data:", profile)

          if (profile && profile.privacy_level === "public") {
            setProfileId(profile.id)
            profileData = profile
            setEnsIdentity(profile.ens_identity || "")
            console.log("[v0] Using public profile:", profile.id)
          } else if (profile) {
            console.log("[v0] Profile found but not public, privacy_level:", profile.privacy_level)
          }
        } else {
          console.log("[v0] No user found for:", params.username)
        }
      }

      if (profileData) {
        const { data: socialLinks } = await supabase
          .from("social_links")
          .select("*")
          .eq("profile_id", profileData.id)
          .eq("is_visible", true)

        if (socialLinks) {
          const formattedAccounts = socialLinks.map((link) => ({
            platform: link.platform,
            handle: link.username || `@${link.username}`,
            followers: "0",
            icon: getPlatformIcon(link.platform),
            color: getPlatformColor(link.platform),
            url: link.url,
            recentPosts: [],
          }))
          setSocialAccounts(formattedAccounts)
        }

        setUserData({
          username: profileData.username || params.username,
          displayName: profileData.display_name || profileData.username || params.username,
          bio: profileData.bio || "No bio available",
          profileImage: profileData.profile_picture_url || "/abstract-profile.png",
          location: profileData.location || "",
          joinDate: new Date(profileData.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          followers: "0",
          following: "0",
        })
      } else {
        console.log("[v0] No profile found for:", params.username)
        setUserData(null)
      }

      if (isOwnProfile && editFromParams) {
        setIsEditMode(true)
      }
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }, [params.username, supabase, editFromParams, isOwnProfile, router])

  useEffect(() => {
    loadProfileData()
  }, [loadProfileData])

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: "📷",
      twitter: "🐦",
      youtube: "📺",
      github: "💻",
      linkedin: "💼",
      tiktok: "🎵",
    }
    return icons[platform] || "🔗"
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      twitter: "bg-blue-500",
      youtube: "bg-red-500",
      github: "bg-gray-800",
      linkedin: "bg-blue-600",
      tiktok: "bg-black",
    }
    return colors[platform] || "bg-gray-500"
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleEditToggle = () => {
    const newEditMode = !isEditMode
    setIsEditMode(newEditMode)

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
        title: `${userData?.displayName} - GetToKnowMe`,
        text: userData?.bio,
        url: profileUrl,
      })
    } else {
      await navigator.clipboard.writeText(profileUrl)
      // Could add a toast notification here
    }
  }

  const handleProfileUpdate = async (updates: Partial<any>) => {
    if (!profileId || !isOwnProfile) return

    try {
      await supabase.from("profiles").update(updates).eq("id", profileId)

      setUserData((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleEnsUpdate = async (ens: string) => {
    if (!profileId || !isOwnProfile) return

    setEnsIdentity(ens)

    try {
      await supabase.from("profiles").update({ ens_identity: ens }).eq("id", profileId)
    } catch (error) {
      console.error("Error updating ENS:", error)
    }
  }

  const profileData = useMemo(
    () => ({
      name: userData?.displayName,
      username: userData?.username,
      bio: userData?.bio,
      avatar: userData?.profileImage,
      location: userData?.location,
      joinDate: userData?.joinDate,
      followers: userData?.followers,
      following: userData?.following,
    }),
    [userData],
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData || !profileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p>The profile "{params.username}" doesn't exist or isn't public.</p>
          <Button onClick={() => router.push("/")} className="mt-4" variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    )
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
          accounts={socialAccounts}
          profileData={profileData}
          profileId={profileId}
          isEditMode={isEditMode && isOwnProfile}
          onEditModeChange={setIsEditMode}
          onProfileUpdate={handleProfileUpdate}
          ensIdentity={ensIdentity}
          onEnsUpdate={handleEnsUpdate}
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
