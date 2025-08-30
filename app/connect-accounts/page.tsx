"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Check, Plus, ExternalLink, Users, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import NextLink from "next/link"

// Social media platform data
const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Share your photos and stories",
    followers: "2.1K",
    posts: 156,
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "🐦",
    color: "bg-blue-500",
    description: "Share your thoughts and updates",
    followers: "892",
    posts: 1240,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    color: "bg-black",
    description: "Share your creative videos",
    followers: "5.3K",
    posts: 89,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "📺",
    color: "bg-red-500",
    description: "Share your video content",
    followers: "1.2K",
    posts: 24,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "bg-blue-600",
    description: "Professional networking",
    followers: "456",
    posts: 67,
  },
  {
    id: "github",
    name: "GitHub",
    icon: "💻",
    color: "bg-gray-800",
    description: "Showcase your code projects",
    followers: "234",
    posts: 45,
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: "🎮",
    color: "bg-purple-600",
    description: "Live streaming platform",
    followers: "678",
    posts: 12,
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "🎧",
    color: "bg-green-500",
    description: "Share your music taste",
    followers: "123",
    posts: 0,
  },
]

export default function ConnectAccountsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<Set<string>>(new Set())
  const [accountSettings, setAccountSettings] = useState<
    Record<string, { showInProfile: boolean; showPosts: boolean }>
  >({})

  const handleConnect = (platformId: string) => {
    // Mock connection process
    setConnectedAccounts((prev) => new Set([...prev, platformId]))
    setAccountSettings((prev) => ({
      ...prev,
      [platformId]: { showInProfile: true, showPosts: true },
    }))
  }

  const handleDisconnect = (platformId: string) => {
    setConnectedAccounts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(platformId)
      return newSet
    })
    setAccountSettings((prev) => {
      const newSettings = { ...prev }
      delete newSettings[platformId]
      return newSettings
    })
  }

  const updateAccountSetting = (platformId: string, setting: "showInProfile" | "showPosts", value: boolean) => {
    setAccountSettings((prev) => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [setting]: value,
      },
    }))
  }

  const connectedPlatforms = socialPlatforms.filter((platform) => connectedAccounts.has(platform.id))
  const availablePlatforms = socialPlatforms.filter((platform) => !connectedAccounts.has(platform.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/create-profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center">
              <Users className="w-4 h-4 text-secondary-foreground" />
            </div>
            <span className="font-semibold">Connect Accounts</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect Your Social Media</h1>
          <p className="text-muted-foreground text-lg">
            Link your accounts to showcase your content and grow your audience
          </p>
        </div>

        {/* Stats Overview */}
        {connectedAccounts.size > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{connectedAccounts.size}</div>
                <div className="text-sm text-muted-foreground">Connected Accounts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">
                  {connectedPlatforms
                    .reduce(
                      (sum, platform) => sum + Number.parseInt(platform.followers.replace("K", "000").replace(".", "")),
                      0,
                    )
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {connectedPlatforms.reduce((sum, platform) => sum + platform.posts, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connected Accounts */}
        {connectedAccounts.size > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-secondary" />
              Connected Accounts ({connectedAccounts.size})
            </h2>
            <div className="grid gap-4">
              {connectedPlatforms.map((platform) => (
                <Card key={platform.id} className="border-2 border-secondary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl`}
                        >
                          {platform.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{platform.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{platform.followers} followers</span>
                            <span>{platform.posts} posts</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={accountSettings[platform.id]?.showInProfile ?? true}
                              onCheckedChange={(checked) => updateAccountSetting(platform.id, "showInProfile", checked)}
                            />
                            <span className="text-sm">Show in profile</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={accountSettings[platform.id]?.showPosts ?? true}
                              onCheckedChange={(checked) => updateAccountSetting(platform.id, "showPosts", checked)}
                            />
                            <span className="text-sm">Show posts</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDisconnect(platform.id)}>
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Available Platforms ({availablePlatforms.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {availablePlatforms.map((platform) => (
              <Card key={platform.id} className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl`}
                      >
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                    <Button onClick={() => handleConnect(platform.id)} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Preview */}
        {connectedAccounts.size > 0 && (
          <div className="mt-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Content Preview
                </CardTitle>
                <CardDescription>Here's how your connected content will appear on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedPlatforms.slice(0, 6).map((platform) => (
                    <div key={platform.id} className="border rounded-lg p-3 bg-muted/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-6 h-6 ${platform.color} rounded text-white text-xs flex items-center justify-center`}
                        >
                          {platform.icon}
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      <div className="bg-muted rounded h-20 mb-2 flex items-center justify-center text-xs text-muted-foreground">
                        Latest post preview
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>2 hours ago</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <NextLink href="/share-profile">
            <Button size="lg" className="px-8">
              Continue to Profile Sharing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </NextLink>
        </div>
      </div>
    </div>
  )
}
