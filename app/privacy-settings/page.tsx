"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Shield, Eye, EyeOff, Users, Globe, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function PrivacySettingsPage() {
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [allowSearchEngines, setAllowSearchEngines] = useState(true)
  const [showFollowerCount, setShowFollowerCount] = useState(true)
  const [allowDirectMessages, setAllowDirectMessages] = useState(true)
  const [showOnlineStatus, setShowOnlineStatus] = useState(false)
  const [requireApproval, setRequireApproval] = useState(false)

  const [platformSettings, setPlatformSettings] = useState({
    instagram: { visible: true, showPosts: true, showFollowers: true },
    twitter: { visible: true, showPosts: true, showFollowers: true },
    youtube: { visible: true, showPosts: true, showFollowers: false },
    linkedin: { visible: true, showPosts: false, showFollowers: true },
  })

  const updatePlatformSetting = (platform: string, setting: string, value: boolean) => {
    setPlatformSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    // TODO: Save settings to backend
    console.log("Privacy settings saved:", {
      profileVisibility,
      allowSearchEngines,
      showFollowerCount,
      allowDirectMessages,
      showOnlineStatus,
      requireApproval,
      platformSettings,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/share-profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sharing
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Privacy Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy & Security</h1>
          <p className="text-muted-foreground text-lg">
            Control who can see your profile and how your information is shared
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Profile Visibility
                </CardTitle>
                <CardDescription>Choose who can see your profile and content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public - Anyone can view
                        </div>
                      </SelectItem>
                      <SelectItem value="unlisted">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          Unlisted - Only with direct link
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private - Invitation only
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {profileVisibility === "public" && (
                    <p className="text-sm text-muted-foreground">
                      Your profile will be visible to everyone and may appear in search results
                    </p>
                  )}
                  {profileVisibility === "unlisted" && (
                    <p className="text-sm text-muted-foreground">
                      Your profile won't appear in search results, but anyone with the link can view it
                    </p>
                  )}
                  {profileVisibility === "private" && (
                    <p className="text-sm text-muted-foreground">Only people you approve can view your profile</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Search Engine Indexing</Label>
                      <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
                    </div>
                    <Switch
                      checked={allowSearchEngines}
                      onCheckedChange={setAllowSearchEngines}
                      disabled={profileVisibility !== "public"}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Follower Count</Label>
                      <p className="text-sm text-muted-foreground">Display your total follower count on your profile</p>
                    </div>
                    <Switch checked={showFollowerCount} onCheckedChange={setShowFollowerCount} />
                  </div>

                  {profileVisibility === "private" && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Require Approval</Label>
                        <p className="text-sm text-muted-foreground">Manually approve each profile view request</p>
                      </div>
                      <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Social Media Privacy
                </CardTitle>
                <CardDescription>Control what information is shown from your connected accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(platformSettings).map(([platform, settings]) => (
                  <div key={platform} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {platform === "instagram" && "📷"}
                          {platform === "twitter" && "🐦"}
                          {platform === "youtube" && "📺"}
                          {platform === "linkedin" && "💼"}
                        </div>
                        <div>
                          <h4 className="font-medium capitalize">{platform}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Connected
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={settings.visible}
                        onCheckedChange={(checked) => updatePlatformSetting(platform, "visible", checked)}
                      />
                    </div>

                    {settings.visible && (
                      <div className="ml-11 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show posts</span>
                          <Switch
                            checked={settings.showPosts}
                            onCheckedChange={(checked) => updatePlatformSetting(platform, "showPosts", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show follower count</span>
                          <Switch
                            checked={settings.showFollowers}
                            onCheckedChange={(checked) => updatePlatformSetting(platform, "showFollowers", checked)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Communication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Communication & Activity
                </CardTitle>
                <CardDescription>Manage how others can interact with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Let people send you messages through your profile</p>
                  </div>
                  <Switch checked={allowDirectMessages} onCheckedChange={setAllowDirectMessages} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Display when you're active on the platform</p>
                  </div>
                  <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Score</CardTitle>
                <CardDescription>Your current privacy level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {profileVisibility === "public" ? "75%" : profileVisibility === "unlisted" ? "85%" : "95%"}
                  </div>
                  <Badge variant={profileVisibility === "public" ? "secondary" : "default"}>
                    {profileVisibility === "public"
                      ? "Moderate"
                      : profileVisibility === "unlisted"
                        ? "High"
                        : "Very High"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Based on your current settings</p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Privacy Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Use "Unlisted" mode to share your profile privately while keeping it accessible</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  <p>Disable search engine indexing if you want to control who finds your profile</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Review your social media privacy settings regularly</p>
                </div>
              </CardContent>
            </Card>

            {/* Data & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Download My Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Delete Account
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Security Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={handleSaveSettings} size="lg" className="px-8">
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
