"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Plus, Calendar, ExternalLink, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ColorPicker } from "@/components/ui/color-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { WidgetBase, type WidgetConfig } from "@/components/widget-base"
import { SocialWidget } from "@/components/widgets/social-widget"
import { getWidgetLayouts, saveWidgetLayout } from "@/lib/database/widget-layouts"

const PREVIEW_WIDGETS = {
  instagram: { name: "Instagram", icon: "📷" },
  twitter: { name: "Twitter", icon: "🐦" },
  tiktok: { name: "TikTok", icon: "🎵" },
  farcaster: { name: "Farcaster", icon: "🟣" },
}

const INTEGRATED_WIDGETS = {
  calendly: { name: "Calendly", icon: "📅", placeholder: "https://calendly.com/yourname" },
  cafecito: { name: "Cafecito", icon: "☕", placeholder: "https://cafecito.app/yourname" },
  github: { name: "GitHub", icon: "💻", placeholder: "https://github.com/username or just username" },
  medium: { name: "Medium", icon: "📝", placeholder: "https://medium.com/@username or just username" },
  youtube: { name: "YouTube", icon: "📺", placeholder: "https://youtube.com/@channelname or just channelname" },
}

const WIDGET_TYPES = {
  ...PREVIEW_WIDGETS,
  ...INTEGRATED_WIDGETS,
  profile: { name: "Profile", icon: "👤" },
}

const WIDGET_COLORS = {
  instagram: ["#E4405F", "#833AB4", "#C13584", "#FD1D1D"],
  twitter: ["#1DA1F2", "#14171A", "#657786", "#AAB8C2"],
  youtube: ["#FF0000", "#282828", "#FFFFFF", "#FF4444"],
  github: ["#333333", "#24292E", "#F6F8FA", "#0366D6"],
  tiktok: ["#000000", "#FF0050", "#25F4EE", "#FE2C55"],
  farcaster: ["#8A63D2", "#472A91", "#9A73E4", "#6B46C1"],
  calendly: ["#006BFF", "#00A2FF", "#0080FF", "#4A90E2"],
  cafecito: ["#FF6B35", "#F7931E", "#FFB74D", "#FF8A65"],
  medium: ["#00AB6C", "#1A8917", "#03A87C", "#00D084"],
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
  allWidgets,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  allWidgets?: WidgetConfig[]
}) {
  const handleClick = () => {
    if (config.integrationUrl) {
      window.open(config.integrationUrl, "_blank")
    }
  }

  const isSmall = config.gridSize.width <= 1 || config.gridSize.height <= 1

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode} allWidgets={allWidgets}>
      <div
        className={`flex items-center gap-2 mb-3 ${isSmall && !isEditMode ? "cursor-pointer" : ""}`}
        onClick={isSmall && !isEditMode ? handleClick : undefined}
      >
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
          <h4 className="font-semibold mb-2">Book a call</h4>
          <p className="text-sm text-muted-foreground mb-4">Let's discuss your project and see how I can help</p>
          {!isSmall && (
            <Button className="w-full" size="sm" onClick={handleClick} disabled={!config.integrationUrl}>
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>
    </WidgetBase>
  )
}

function CafecitoWidget({
  config,
  onConfigChange,
  isEditMode,
  allWidgets,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  allWidgets?: WidgetConfig[]
}) {
  const handleClick = () => {
    if (config.integrationUrl) {
      window.open(config.integrationUrl, "_blank")
    }
  }

  return (
    <WidgetBase
      config={config}
      onConfigChange={onConfigChange}
      isEditMode={isEditMode}
      allWidgets={allWidgets}
      minSize={{ width: 1, height: 1 }}
      maxSize={{ width: 2, height: 1 }}
    >
      <div
        className={`flex items-center justify-between h-full ${!isEditMode ? "cursor-pointer" : ""}`}
        onClick={!isEditMode ? handleClick : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">☕</div>
          <div>
            <h3 className="font-semibold text-sm">Buy me a coffee</h3>
            <p className="text-xs text-muted-foreground">Support my work</p>
          </div>
        </div>
      </div>
    </WidgetBase>
  )
}

function GitHubWidget({
  config,
  onConfigChange,
  isEditMode,
  allWidgets,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  allWidgets?: WidgetConfig[]
}) {
  const [githubData, setGithubData] = useState<{
    total: { lastYear: number }
    contributions: Array<{ date: string; count: number; level: number }>
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (config.integrationUrl) {
      fetchGitHubData(config.integrationUrl)
    }
  }, [config.integrationUrl])

  const extractUsername = (input: string): string => {
    // Extract username from GitHub URL or return as-is if it's just a username
    const githubUrlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/
    const match = input.match(githubUrlRegex)
    return match ? match[1] : input.trim()
  }

  const fetchGitHubData = async (input: string) => {
    const extractedUsername = extractUsername(input)
    setUsername(extractedUsername)
    setLoading(true)

    try {
      const response = await fetch(`/api/github-contributions?username=${extractedUsername}`)
      if (response.ok) {
        const data = await response.json()
        setGithubData(data)
      } else {
        console.error("Failed to fetch GitHub data")
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    if (username) {
      window.open(`https://github.com/${username}`, "_blank")
    }
  }

  const getContributionColor = (level: number): string => {
    const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
    return colors[level] || colors[0]
  }

  // Get last 12 weeks of data for the chart
  const getRecentContributions = () => {
    if (!githubData) return []
    const recent = githubData.contributions.slice(-84) // Last 12 weeks
    const weeks = []
    for (let i = 0; i < recent.length; i += 7) {
      weeks.push(recent.slice(i, i + 7))
    }
    return weeks
  }

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode} allWidgets={allWidgets}>
      <div className={`h-full ${!isEditMode ? "cursor-pointer" : ""}`} onClick={!isEditMode ? handleClick : undefined}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">💻</div>
          <div>
            <h3 className="font-semibold text-sm">GitHub</h3>
            <p className="text-xs text-muted-foreground">{username ? `@${username}` : "Connect your GitHub"}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="text-xs text-muted-foreground">Loading...</div>
          </div>
        ) : githubData ? (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{githubData.total.lastYear}</div>
              <div className="text-xs text-muted-foreground">contributions last year</div>
            </div>

            <div className="overflow-hidden">
              <div className="grid grid-cols-12 gap-[1px] max-w-full">
                {getRecentContributions().map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px]">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: getContributionColor(day.level) }}
                        title={`${day.count} contributions on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Connect your GitHub</div>
              <div className="text-xs text-muted-foreground">to see contributions</div>
            </div>
          </div>
        )}
      </div>
    </WidgetBase>
  )
}

function MediumWidget({
  config,
  onConfigChange,
  isEditMode,
  allWidgets,
}: {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  allWidgets?: WidgetConfig[]
}) {
  const [mediumData, setMediumData] = useState<{
    title: string
    description: string
    articles: Array<{
      title: string
      link: string
      pubDate: string
      creator: string
      categories: string[]
    }>
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (config.integrationUrl) {
      fetchMediumData(config.integrationUrl)
    }
  }, [config.integrationUrl])

  const extractUsername = (input: string): string => {
    // Extract username from Medium URL or return as-is if it's just a username
    const mediumUrlRegex = /(?:https?:\/\/)?(?:www\.)?medium\.com\/@([^/?#]+)/
    const match = input.match(mediumUrlRegex)
    return match ? match[1] : input.replace("@", "").trim()
  }

  const fetchMediumData = async (input: string) => {
    const extractedUsername = extractUsername(input)
    setUsername(extractedUsername)
    setLoading(true)

    try {
      const response = await fetch(`/api/medium-articles?username=${extractedUsername}`)
      if (response.ok) {
        const data = await response.json()
        setMediumData(data)
      } else {
        console.error("Failed to fetch Medium data")
      }
    } catch (error) {
      console.error("Error fetching Medium data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    if (username) {
      window.open(`https://medium.com/@${username}`, "_blank")
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode} allWidgets={allWidgets}>
      <div className={`h-full ${!isEditMode ? "cursor-pointer" : ""}`} onClick={!isEditMode ? handleClick : undefined}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">📝</div>
          <div>
            <h3 className="font-semibold text-sm">Medium</h3>
            <p className="text-xs text-muted-foreground">{username ? `@${username}` : "Connect your Medium"}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="text-xs text-muted-foreground">Loading articles...</div>
          </div>
        ) : mediumData && mediumData.articles.length > 0 ? (
          <div className="space-y-3 overflow-hidden">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{mediumData.articles.length}</div>
              <div className="text-xs text-muted-foreground">articles published</div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {mediumData.articles.slice(0, 3).map((article, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-2">
                  <h4 className="text-xs font-medium line-clamp-2 leading-tight">{article.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{formatDate(article.pubDate)}</span>
                    {article.categories.length > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-green-600 font-medium">{article.categories[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Connect your Medium</div>
              <div className="text-xs text-muted-foreground">to see articles</div>
            </div>
          </div>
        )}
      </div>
    </WidgetBase>
  )
}

const YouTubeWidget = ({ config, onConfigChange, isEditMode, allWidgets }: any) => {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extractChannelName = (input: string): string => {
    // Handle various YouTube URL formats
    const patterns = [
      /youtube\.com\/@([^/?]+)/,
      /youtube\.com\/c\/([^/?]+)/,
      /youtube\.com\/channel\/([^/?]+)/,
      /youtube\.com\/user\/([^/?]+)/,
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) return match[1]
    }

    // If no URL pattern matches, assume it's a plain channel name
    return input.replace("@", "")
  }

  useEffect(() => {
    if (!config.integrationUrl) return

    const fetchVideos = async () => {
      setLoading(true)
      setError(null)

      try {
        const channelName = extractChannelName(config.integrationUrl)
        const response = await fetch(`/api/youtube-videos?channel=${encodeURIComponent(channelName)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()
        setVideos(data.videos || [])
      } catch (err) {
        setError("Failed to load videos")
        console.error("YouTube fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [config.integrationUrl])

  const handleClick = () => {
    if (config.integrationUrl) {
      const channelName = extractChannelName(config.integrationUrl)
      window.open(`https://youtube.com/@${channelName}`, "_blank")
    }
  }

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode} allWidgets={allWidgets}>
      <div className="h-full cursor-pointer hover:opacity-90 transition-opacity" onClick={handleClick}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            ▶
          </div>
          <div>
            <div className="font-semibold text-sm">YouTube</div>
            {videos.length > 0 && <div className="text-xs text-gray-600">{videos.length} recent videos</div>}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-xs text-center py-4">{error}</div>}

        {!loading && !error && videos.length > 0 && (
          <div className="space-y-2">
            {videos.slice(0, 3).map((video, index) => (
              <div key={index} className="flex gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-red-500 text-xs">▶</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs leading-tight line-clamp-2">{video.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(video.publishedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && videos.length === 0 && config.integrationUrl && (
          <div className="text-gray-500 text-xs text-center py-4">No videos found</div>
        )}

        {!config.integrationUrl && (
          <div className="text-gray-500 text-xs text-center py-4">Configure YouTube channel</div>
        )}
      </div>
    </WidgetBase>
  )
}

interface WidgetGridProps {
  accounts: any[]
  profileData: ProfileData
  profileId: string
  isEditMode: boolean
  onEditModeChange: (editMode: boolean) => void
  onProfileUpdate?: (updates: Partial<ProfileData>) => void
  ensIdentity?: string
  onEnsUpdate?: (ens: string) => void
  onBioChange?: (bio: string) => void // Added onBioChange prop for debounced bio updates
}

export function WidgetGrid({
  accounts,
  profileData,
  profileId,
  isEditMode,
  onEditModeChange,
  onProfileUpdate,
  ensIdentity,
  onEnsUpdate,
  onBioChange, // Added onBioChange prop
}: WidgetGridProps) {
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [integrationDialog, setIntegrationDialog] = useState<{
    isOpen: boolean
    widgetType: string
    url: string
    editingWidgetId?: string // Added editingWidgetId to track which widget is being edited
  }>({
    isOpen: false,
    widgetType: "",
    url: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    async function loadWidgetConfigs() {
      try {
        const configs = await getWidgetLayouts(profileId)

        if (configs.length === 0) {
          const defaultConfigs = createDefaultWidgetConfigs(accounts)
          setWidgetConfigs(defaultConfigs)

          for (const config of defaultConfigs) {
            await saveWidgetLayout(config, profileId)
          }
        } else {
          setWidgetConfigs(configs)
        }
      } catch (error) {
        console.error("Error loading widget configs:", error)
        setWidgetConfigs(createDefaultWidgetConfigs(accounts))
      } finally {
        setIsLoading(false)
      }
    }

    loadWidgetConfigs()
  }, [profileId, accounts])

  function generateUUID(): string {
    return globalThis.crypto.randomUUID()
  }

  function createDefaultWidgetConfigs(accounts: any[]): WidgetConfig[] {
    const socialConfigs: WidgetConfig[] = accounts.map((account, index) => ({
      id: generateUUID(),
      type:
        account.platform === "calendly" ||
        account.platform === "cafecito" ||
        account.platform === "github" ||
        account.platform === "medium" ||
        account.platform === "youtube"
          ? "service"
          : "social",
      platform: account.platform,
      gridPosition: {
        x: (index % 4) * 2,
        y: Math.floor(index / 4) * 2,
      },
      gridSize: { width: account.platform === "cafecito" ? 2 : 2, height: account.platform === "cafecito" ? 1 : 2 },
      visible: true,
    }))

    return socialConfigs
  }

  const handleConfigChange = async (id: string, newConfig: Partial<WidgetConfig>) => {
    const oldConfig = widgetConfigs.find((w) => w.id === id)

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

    const updatedWidget = widgetConfigs.find((w) => w.id === id)
    if (updatedWidget) {
      const configToSave = { ...updatedWidget, ...newConfig }
      await saveWidgetLayout(configToSave, profileId)

      if (newConfig.gridPosition && oldConfig) {
        toast({
          description: `${WIDGET_TYPES[oldConfig.platform as keyof typeof WIDGET_TYPES]?.name || "Widget"} moved`,
        })
      } else if (newConfig.gridSize && oldConfig) {
        toast({
          description: `${WIDGET_TYPES[oldConfig.platform as keyof typeof WIDGET_TYPES]?.name || "Widget"} resized`,
        })
      } else if (newConfig.customColor) {
        toast({
          description: `${WIDGET_TYPES[oldConfig?.platform as keyof typeof WIDGET_TYPES]?.name || "Widget"} color updated`,
        })
      }
    }
  }

  const addWidget = async (type: string, integrationUrl?: string) => {
    console.log("[v0] Adding widget:", type)

    const newWidget: WidgetConfig = {
      id: Date.now().toString(),
      type:
        type === "youtube"
          ? "youtube"
          : type === "medium"
            ? "medium"
            : type === "github"
              ? "github"
              : type === "calendly"
                ? "service"
                : type === "cafecito"
                  ? "service"
                  : "social",
      platform: type,
      gridPosition: { x: 0, y: 0 },
      gridSize: { width: 2, height: 2 },
      visible: true,
      integrationUrl,
    }

    setWidgetConfigs((prev) => [...prev, newWidget])
    await saveWidgetLayout(newWidget, profileId)

    toast({
      description: `${WIDGET_TYPES[type as keyof typeof WIDGET_TYPES]?.name || "Widget"} added`,
    })
  }

  const handleIntegrationSubmit = async () => {
    if (!integrationDialog.url.trim()) {
      toast({
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    if (integrationDialog.editingWidgetId) {
      // Update existing widget
      await handleConfigChange(integrationDialog.editingWidgetId, {
        integrationUrl: integrationDialog.url,
      })

      toast({
        description: `${WIDGET_TYPES[integrationDialog.widgetType as keyof typeof WIDGET_TYPES]?.name || "Widget"} updated`,
      })
    } else {
      // Create new widget
      await addWidget(integrationDialog.widgetType, integrationDialog.url)
    }

    setIntegrationDialog({ isOpen: false, widgetType: "", url: "" }) // Reset editingWidgetId
  }

  const editWidget = (widget: WidgetConfig) => {
    setIntegrationDialog({
      isOpen: true,
      widgetType: widget.platform,
      url: widget.integrationUrl || "",
      editingWidgetId: widget.id,
    })
  }

  const createMockAccount = (platform: string): any => {
    const mockAccounts: Record<string, any> = {
      instagram: {
        platform: "Instagram",
        handle: "@yourhandle",
        followers: "12.5K followers",
        icon: "📷",
        color: "#E4405F",
        url: `https://instagram.com/yourhandle`,
      },
      twitter: {
        platform: "Twitter",
        handle: "@yourhandle",
        followers: "8.2K followers",
        icon: "🐦",
        color: "#1DA1F2",
        url: `https://twitter.com/yourhandle`,
      },
      youtube: {
        platform: "YouTube",
        handle: "Your Channel",
        followers: "5.8K subscribers",
        icon: "📺",
        color: "#FF0000",
        url: `https://youtube.com/@yourhandle`,
      },
      github: {
        platform: "GitHub",
        handle: "yourhandle",
        followers: "234 followers",
        icon: "💻",
        color: "#333333",
        url: `https://github.com/yourhandle`,
      },
      tiktok: {
        platform: "TikTok",
        handle: "@yourhandle",
        followers: "45.2K followers",
        icon: "🎵",
        color: "#000000",
        url: `https://tiktok.com/@yourhandle`,
      },
      farcaster: {
        platform: "Farcaster",
        handle: "@yourhandle",
        followers: "1.8K followers",
        icon: "🟣",
        color: "#8A63D2",
        url: `https://warpcast.com/yourhandle`,
      },
      medium: {
        platform: "Medium",
        handle: "@yourhandle",
        followers: "10 articles",
        icon: "📝",
        color: "#00AB6C",
        url: `https://medium.com/@yourhandle`,
      },
    }

    return mockAccounts[platform] || mockAccounts.instagram
  }

  const handleColorChange = async (widgetId: string, color: string) => {
    await handleConfigChange(widgetId, { customColor: color })
  }

  const gridWidgets = widgetConfigs.filter((w) => w.visible)

  const GRID_SIZE = 40 // Reduced from 60 to 40 for much more granular positioning
  const GRID_GAP = 8 // Reduced from 10 to 8 for even tighter spacing

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <p>Loading widgets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!isEditMode ? (
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4 flex-1">
            <img
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">@{profileData.username}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">{profileData.bio}</p>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white min-w-[200px]">
              <div className="text-center">
                {ensIdentity ? (
                  <div>
                    <a
                      href={`https://peanut.me/${ensIdentity}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-lg hover:underline transition-all duration-200 hover:text-blue-100"
                    >
                      {ensIdentity}
                    </a>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <a
                        href={`https://peanut.me/${ensIdentity}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-100 opacity-90 hover:opacity-100 transition-opacity"
                      >
                        💰 Send tips
                      </a>
                      <span className="text-blue-100 opacity-50">•</span>
                      <a
                        href={`https://app.ens.domains/${ensIdentity}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-100 opacity-90 hover:opacity-100 transition-opacity"
                      >
                        🌐 My ENS
                      </a>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-bold text-lg">ENS.ETH</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex gap-4">
        {isEditMode && (
          <div className="w-64 bg-card border rounded-lg p-4 h-fit">
            <h3 className="font-semibold mb-3">Available Widgets</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Integrated Widgets</h4>
                <div className="space-y-2">
                  {Object.entries(INTEGRATED_WIDGETS).map(([type, info]) => {
                    const existingWidget = widgetConfigs.find((w) => w.platform === type)

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{info.icon}</span>
                            <span className="text-sm font-medium">{info.name}</span>
                            {existingWidget?.integrationUrl && <ExternalLink className="w-3 h-3 text-green-500" />}
                          </div>

                          <div className="flex items-center gap-1">
                            {existingWidget &&
                              existingWidget.visible &&
                              WIDGET_COLORS[type as keyof typeof WIDGET_COLORS] && (
                                <ColorPicker
                                  value={
                                    existingWidget.customColor || WIDGET_COLORS[type as keyof typeof WIDGET_COLORS][0]
                                  }
                                  onChange={(color) => handleColorChange(existingWidget.id, color)}
                                  presetColors={WIDGET_COLORS[type as keyof typeof WIDGET_COLORS]}
                                  size="sm"
                                />
                              )}

                            {existingWidget && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editWidget(existingWidget)}
                                className="h-6 w-6 p-0"
                                title="Edit integration"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            )}

                            {existingWidget ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  await handleConfigChange(existingWidget.id, { visible: !existingWidget.visible })
                                  toast({
                                    description: `${info.name} ${existingWidget.visible ? "hidden" : "shown"}`,
                                  })
                                }}
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
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Preview Widgets</h4>
                <div className="space-y-2">
                  {Object.entries(PREVIEW_WIDGETS).map(([type, info]) => {
                    const existingWidget = widgetConfigs.find((w) => w.platform === type)

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{info.icon}</span>
                            <span className="text-sm font-medium">{info.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {existingWidget &&
                              existingWidget.visible &&
                              WIDGET_COLORS[type as keyof typeof WIDGET_COLORS] && (
                                <ColorPicker
                                  value={
                                    existingWidget.customColor || WIDGET_COLORS[type as keyof typeof WIDGET_COLORS][0]
                                  }
                                  onChange={(color) => handleColorChange(existingWidget.id, color)}
                                  presetColors={WIDGET_COLORS[type as keyof typeof WIDGET_COLORS]}
                                  size="sm"
                                />
                              )}

                            {existingWidget ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  await handleConfigChange(existingWidget.id, { visible: !existingWidget.visible })
                                  toast({
                                    description: `${info.name} ${existingWidget.visible ? "hidden" : "shown"}`,
                                  })
                                }}
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
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {isEditMode && (
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-xl font-bold">{profileData.name}</h1>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => onBioChange?.(e.target.value)}
                    placeholder="Write your bio..."
                    className="text-sm text-muted-foreground mt-1 max-w-md w-full resize-none border rounded p-2 min-h-[60px]"
                  />
                </div>
              </div>

              <div className="flex-shrink-0 ml-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white min-w-[200px]">
                  <div className="text-center">
                    <div>
                      <h3 className="font-bold text-sm mb-2">ENS Identity</h3>
                      <input
                        type="text"
                        value={ensIdentity || ""}
                        onChange={(e) => onEnsUpdate?.(e.target.value)}
                        placeholder="yourname.eth"
                        className="w-full text-center bg-white/20 border border-white/30 rounded px-2 py-1 text-sm placeholder-white/70"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`relative min-h-[600px] transition-all duration-200 ${
              isEditMode ? "bg-gradient-to-br from-muted/20 to-muted/40" : ""
            }`}
            style={{
              backgroundImage: isEditMode
                ? `radial-gradient(circle at 1px 1px, rgba(var(--primary), 0.15) 1px, transparent 0)`
                : undefined,
              backgroundSize: isEditMode ? `${GRID_SIZE + GRID_GAP}px ${GRID_SIZE + GRID_GAP}px` : undefined,
            }}
          >
            {gridWidgets.map((config) => {
              if (config.type === "social") {
                let account = accounts.find((a) => a.platform === config.platform)
                if (!account) {
                  console.log("[v0] No real account found for", config.platform, "using mock data")
                  account = createMockAccount(config.platform)
                }

                return (
                  <SocialWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    account={account}
                    customColor={config.customColor}
                    allWidgets={widgetConfigs}
                  />
                )
              } else if (config.platform === "calendly") {
                return (
                  <CalendlyWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    allWidgets={widgetConfigs}
                  />
                )
              } else if (config.platform === "cafecito") {
                return (
                  <CafecitoWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    allWidgets={widgetConfigs}
                  />
                )
              } else if (config.platform === "github") {
                return (
                  <GitHubWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    allWidgets={widgetConfigs}
                  />
                )
              } else if (config.platform === "medium") {
                return (
                  <MediumWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    allWidgets={widgetConfigs}
                  />
                )
              } else if (config.platform === "youtube") {
                return (
                  <YouTubeWidget
                    key={config.id}
                    config={config}
                    onConfigChange={handleConfigChange}
                    isEditMode={isEditMode}
                    allWidgets={widgetConfigs}
                  />
                )
              }
              return null
            })}

            {isEditMode && gridWidgets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No widgets in grid</p>
                  <p className="text-sm">Use the widget panel to add widgets</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={integrationDialog.isOpen}
        onOpenChange={(open) => setIntegrationDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {integrationDialog.editingWidgetId ? "Edit" : "Connect"}{" "}
              {WIDGET_TYPES[integrationDialog.widgetType as keyof typeof WIDGET_TYPES]?.name}
            </DialogTitle>
            <DialogDescription>
              {integrationDialog.editingWidgetId ? "Update" : "Enter"} your{" "}
              {WIDGET_TYPES[integrationDialog.widgetType as keyof typeof WIDGET_TYPES]?.name} URL to{" "}
              {integrationDialog.editingWidgetId ? "update" : "connect"} your widget.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="integration-url">
                {WIDGET_TYPES[integrationDialog.widgetType as keyof typeof WIDGET_TYPES]?.name} URL
              </Label>
              <Input
                id="integration-url"
                value={integrationDialog.url}
                onChange={(e) => setIntegrationDialog((prev) => ({ ...prev, url: e.target.value }))}
                placeholder={
                  INTEGRATED_WIDGETS[integrationDialog.widgetType as keyof typeof INTEGRATED_WIDGETS]?.placeholder
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIntegrationDialog({ isOpen: false, widgetType: "", url: "" })}>
              Cancel
            </Button>
            <Button onClick={handleIntegrationSubmit}>
              {integrationDialog.editingWidgetId ? "Update Widget" : "Add Widget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
