import { WidgetBase, type WidgetConfig } from "@/components/widget-base"

interface SocialAccount {
  platform: string
  handle: string
  followers: string
  icon: string
  color: string
  url: string
  recentPosts?: any[]
}

interface SocialWidgetProps {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  account: SocialAccount
  customColor?: string // Added customColor prop for color customization
}

export function SocialWidget({ config, onConfigChange, isEditMode, account, customColor }: SocialWidgetProps) {
  const gridWidth = config.gridSize.width
  const gridHeight = config.gridSize.height

  const PLATFORM_STYLES = {
    Instagram: {
      bgColor: customColor ? `bg-[${customColor}]/20` : "bg-gradient-to-br from-purple-200 to-purple-300",
      iconColor: customColor || "bg-gradient-to-r from-purple-500 to-pink-500",
      textColor: "text-purple-900",
    },
    Twitter: {
      bgColor: customColor ? `bg-[${customColor}]/20` : "bg-gradient-to-br from-sky-200 to-blue-300",
      iconColor: customColor || "bg-blue-500",
      textColor: "text-blue-900",
    },
    GitHub: {
      bgColor: customColor ? `bg-[${customColor}]/20` : "bg-gradient-to-br from-yellow-200 to-yellow-300",
      iconColor: customColor || "bg-gray-900",
      textColor: "text-gray-900",
    },
    TikTok: {
      bgColor: customColor ? `bg-[${customColor}]/20` : "bg-white",
      iconColor: customColor || "bg-black",
      textColor: "text-gray-900",
    },
  }

  const platformStyle = PLATFORM_STYLES[account.platform as keyof typeof PLATFORM_STYLES] || {
    bgColor: customColor ? `bg-[${customColor}]/20` : "bg-card",
    iconColor: customColor || account.color,
    textColor: "text-foreground",
  }

  // Enhanced mock data with realistic content
  const ENHANCED_MOCK_DATA = {
    Instagram: {
      recentPosts: [
        { image: "/vibrant-coastal-sunset.png", likes: "2.1K", comments: "89" },
        { image: "/steaming-coffee-cup.png", likes: "1.8K", comments: "67" },
        { image: "/vibrant-cityscape.png", likes: "3.2K", comments: "124" },
      ],
    },
    Twitter: {
      recentPosts: [
        {
          text: "Building something amazing with the team today! 🚀 #startup #tech",
          likes: "847",
          retweets: "156",
          time: "2h",
        },
        {
          text: "Just shipped a new feature that I'm really excited about! The future is here ✨",
          likes: "1.2K",
          retweets: "234",
          time: "5h",
        },
        {
          text: "Coffee and code - the perfect combination ☕️💻",
          likes: "523",
          retweets: "89",
          time: "1d",
        },
      ],
    },
    GitHub: {
      contributions: "1,247 contributions in the last year",
      streak: "47 day streak",
      topRepo: "awesome-project",
    },
    TikTok: {
      recentVideos: [
        { thumbnail: "/steaming-coffee-cup.png", views: "2.1M", title: "5 healthy habits 💪" },
        { thumbnail: "/vibrant-cityscape.png", views: "890K", title: "Day in my life" },
      ],
    },
  }

  const mockData = ENHANCED_MOCK_DATA[account.platform as keyof typeof ENHANCED_MOCK_DATA]

  return (
    <WidgetBase
      config={config}
      onConfigChange={onConfigChange}
      isEditMode={isEditMode}
      className={platformStyle.bgColor}
      style={customColor ? { backgroundColor: `${customColor}20` } : undefined}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`}
          style={customColor ? { backgroundColor: customColor } : undefined}
        >
          {account.platform === "Instagram" && "📷"}
          {account.platform === "Twitter" && "🐦"}
          {account.platform === "GitHub" && <span className="text-white">💻</span>}
          {account.platform === "TikTok" && "🎵"}
        </div>
        <div>
          <h3 className={`font-semibold text-sm ${platformStyle.textColor}`}>
            {account.platform === "Twitter"
              ? "X.com/gettoknowme"
              : account.platform === "GitHub"
                ? "Github.com/gettoknowme"
                : account.platform === "TikTok"
                  ? "tiktok.com/gettoknowme"
                  : account.platform}
          </h3>
        </div>
      </div>

      <div className="space-y-3 h-full overflow-hidden">
        {account.platform === "Instagram" && (
          <div className="grid grid-cols-3 gap-2">
            {mockData?.recentPosts?.map((post, index) => (
              <div key={index} className="aspect-square relative group cursor-pointer">
                <img
                  src={post.image || "/placeholder.svg?height=100&width=100&query=instagram post"}
                  alt="Instagram post"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {account.platform === "Twitter" && (
          <div className="space-y-2">
            {mockData?.recentPosts?.slice(0, 3).map((post, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-3 text-white text-xs">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold">@gettoknowme</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">{post.time}</span>
                    </div>
                    <p className="leading-relaxed">{post.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {account.platform === "GitHub" && (
          <div className="space-y-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-lg">🐙</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="grid grid-cols-12 gap-1 mb-2">
                {Array.from({ length: 84 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-sm ${
                      Math.random() > 0.7
                        ? "bg-green-500"
                        : Math.random() > 0.5
                          ? "bg-green-400"
                          : Math.random() > 0.3
                            ? "bg-green-300"
                            : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-300 text-center">1,247 contributions in the last year</p>
            </div>
          </div>
        )}

        {account.platform === "TikTok" && (
          <div className="grid grid-cols-2 gap-2">
            {mockData?.recentVideos?.map((video, index) => (
              <div key={index} className="aspect-[3/4] relative group cursor-pointer">
                <img
                  src={video.thumbnail || "/placeholder.svg?height=120&width=90&query=tiktok video"}
                  alt="TikTok video"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium bg-black/50 rounded px-1 py-0.5 truncate">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetBase>
  )
}
