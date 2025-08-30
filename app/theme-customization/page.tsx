"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Palette, Check, Eye, Sparkles, Sun, Moon, Zap } from "lucide-react"
import Link from "next/link"

interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
  }
  style: "modern" | "minimal" | "vibrant" | "dark" | "gradient"
  preview: string
}

const themes: Theme[] = [
  {
    id: "default",
    name: "Default Blue",
    description: "Clean and professional with blue accents",
    colors: {
      primary: "#3B82F6",
      secondary: "#10B981",
      background: "#FFFFFF",
      foreground: "#374151",
      accent: "#F3F4F6",
    },
    style: "modern",
    preview: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    description: "Warm oranges and pinks for creative profiles",
    colors: {
      primary: "#F97316",
      secondary: "#EC4899",
      background: "#FFF7ED",
      foreground: "#9A3412",
      accent: "#FED7AA",
    },
    style: "vibrant",
    preview: "bg-gradient-to-br from-orange-500 to-pink-500",
  },
  {
    id: "forest",
    name: "Forest Green",
    description: "Natural greens for eco-conscious creators",
    colors: {
      primary: "#059669",
      secondary: "#84CC16",
      background: "#F0FDF4",
      foreground: "#064E3B",
      accent: "#DCFCE7",
    },
    style: "minimal",
    preview: "bg-gradient-to-br from-emerald-600 to-lime-500",
  },
  {
    id: "midnight",
    name: "Midnight Dark",
    description: "Sleek dark theme with purple accents",
    colors: {
      primary: "#8B5CF6",
      secondary: "#06B6D4",
      background: "#0F172A",
      foreground: "#F1F5F9",
      accent: "#1E293B",
    },
    style: "dark",
    preview: "bg-gradient-to-br from-slate-900 to-purple-900",
  },
  {
    id: "coral",
    name: "Coral Reef",
    description: "Tropical coral and teal combination",
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      background: "#FFFBF7",
      foreground: "#2D3748",
      accent: "#FED7D7",
    },
    style: "vibrant",
    preview: "bg-gradient-to-br from-red-400 to-teal-400",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Classic black and white minimalism",
    colors: {
      primary: "#000000",
      secondary: "#6B7280",
      background: "#FFFFFF",
      foreground: "#111827",
      accent: "#F9FAFB",
    },
    style: "minimal",
    preview: "bg-gradient-to-br from-gray-900 to-gray-600",
  },
]

export default function ThemeCustomizationPage() {
  const [selectedTheme, setSelectedTheme] = useState("default")
  const [previewMode, setPreviewMode] = useState(false)

  const currentTheme = themes.find((theme) => theme.id === selectedTheme) || themes[0]

  const handleApplyTheme = () => {
    // TODO: Save theme selection to backend
    console.log("Theme applied:", selectedTheme)
  }

  const mockUserData = {
    username: "alexcreator",
    displayName: "Alex Johnson",
    bio: "Digital creator, photographer, and storyteller. Sharing my journey through life, travel, and creativity.",
    profileImage: "/abstract-profile.png",
    followers: "12.5K",
    connectedAccounts: [
      { platform: "Instagram", icon: "📷", color: "from-purple-500 to-pink-500" },
      { platform: "Twitter", icon: "🐦", color: "from-blue-400 to-blue-600" },
      { platform: "YouTube", icon: "📺", color: "from-red-500 to-red-600" },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/payment-settings"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payment
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Theme Customization</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Customize Your Theme</h1>
          <p className="text-muted-foreground text-lg">Choose a theme that reflects your personality and brand</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Theme Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="themes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="themes">Choose Theme</TabsTrigger>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
              </TabsList>

              {/* Theme Selection Tab */}
              <TabsContent value="themes" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTheme === theme.id ? "ring-2 ring-primary border-primary" : "border-2"
                      }`}
                      onClick={() => setSelectedTheme(theme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${theme.preview}`} />
                            <div>
                              <h3 className="font-semibold">{theme.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {theme.style}
                              </Badge>
                            </div>
                          </div>
                          {selectedTheme === theme.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>

                        {/* Color Palette Preview */}
                        <div className="flex gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-background"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-background"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-background"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Live Preview Tab */}
              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Profile Preview - {currentTheme.name}
                    </CardTitle>
                    <CardDescription>See how your profile will look with the selected theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Mock Profile Preview */}
                    <div
                      className="border-2 rounded-lg p-6 space-y-6"
                      style={{
                        backgroundColor: currentTheme.colors.background,
                        color: currentTheme.colors.foreground,
                        borderColor: currentTheme.colors.accent,
                      }}
                    >
                      {/* Profile Header */}
                      <div className="text-center">
                        <Avatar
                          className="w-20 h-20 mx-auto mb-4 border-2"
                          style={{ borderColor: currentTheme.colors.primary }}
                        >
                          <AvatarImage src={mockUserData.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold mb-1">{mockUserData.displayName}</h2>
                        <Badge
                          className="mb-3"
                          style={{
                            backgroundColor: currentTheme.colors.secondary,
                            color: currentTheme.colors.background,
                          }}
                        >
                          @{mockUserData.username}
                        </Badge>
                        <p className="text-sm opacity-80 mb-4">{mockUserData.bio}</p>
                        <div className="text-sm opacity-70">{mockUserData.followers} followers</div>
                      </div>

                      {/* Connected Accounts Preview */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Connected Accounts</h3>
                        {mockUserData.connectedAccounts.map((account, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg"
                            style={{ backgroundColor: currentTheme.colors.accent }}
                          >
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${account.color} rounded-lg flex items-center justify-center text-white text-sm`}
                            >
                              {account.icon}
                            </div>
                            <span className="font-medium text-sm">{account.platform}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button Preview */}
                      <div className="text-center">
                        <button
                          className="px-6 py-2 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.background,
                          }}
                        >
                          Follow Me
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Theme</CardTitle>
                <CardDescription>Your active theme selection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${currentTheme.preview}`} />
                  <div>
                    <h3 className="font-semibold">{currentTheme.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {currentTheme.style}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{currentTheme.description}</p>

                {/* Color Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Color Palette</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                      <span>Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.secondary }}
                      />
                      <span>Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.background }}
                      />
                      <span>Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: currentTheme.colors.accent }} />
                      <span>Accent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme Styles</CardTitle>
                <CardDescription>Browse by style category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span>Modern ({themes.filter((t) => t.style === "modern").length})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Vibrant ({themes.filter((t) => t.style === "vibrant").length})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>Minimal ({themes.filter((t) => t.style === "minimal").length})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Moon className="w-4 h-4 text-gray-500" />
                  <span>Dark ({themes.filter((t) => t.style === "dark").length})</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Choose colors that match your brand or personality</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  <p>Dark themes work great for tech and gaming profiles</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Vibrant themes are perfect for creative and artistic content</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apply Theme Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={handleApplyTheme} size="lg" className="px-8">
            Apply {currentTheme.name} Theme
          </Button>
        </div>
      </div>
    </div>
  )
}
