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
  allWidgets?: WidgetConfig[] // Added allWidgets prop for collision detection
}

export function SocialWidget({
  config,
  onConfigChange,
  isEditMode,
  account,
  customColor,
  allWidgets,
}: SocialWidgetProps) {
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
    YouTube: {
      bgColor: customColor ? `bg-[${customColor}]/20` : "bg-red-200",
      iconColor: customColor || "bg-red-500",
      textColor: "text-red-900",
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
        {
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-57.jpg-NbJZnf7aB2jncNiLBm2AgNaU9E41bb.jpeg",
          likes: "2.1K",
          comments: "89",
        },
        {
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-51.jpg-lC1OeE6lYpEdpWY9Gv9NvWiAYccuqH.jpeg",
          likes: "1.8K",
          comments: "67",
        },
        {
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-46.jpg-kLehh4UkdAyQ6ntjrYo68qLj2iWeYV.jpeg",
          likes: "3.2K",
          comments: "124",
        },
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
      languages: ["TypeScript", "React", "Python"],
    },
    TikTok: {
      recentVideos: [
        {
          thumbnail:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-40.jpg-Q6gIOOAVH6BKww9ypJ7kzXcTB77eT9.jpeg",
          views: "2.1M",
          title: "Follow for more tips! 💡",
          duration: "0:15",
        },
        {
          thumbnail:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-57.jpg-NbJZnf7aB2jncNiLBm2AgNaU9E41bb.jpeg",
          views: "890K",
          title: "Day in my life ⚽️",
          duration: "0:30",
        },
      ],
    },
    YouTube: {
      recentVideos: [
        {
          thumbnail:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-46.jpg-kLehh4UkdAyQ6ntjrYo68qLj2iWeYV.jpeg",
          title: "Epic Mountain Adventure",
          views: "45K",
          duration: "12:34",
        },
        {
          thumbnail:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-08-30_19-14-51.jpg-lC1OeE6lYpEdpWY9Gv9NvWiAYccuqH.jpeg",
          title: "European Street Food Tour",
          views: "32K",
          duration: "8:21",
        },
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
      allWidgets={allWidgets} // Pass allWidgets prop to WidgetBase for collision detection
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
          {account.platform === "YouTube" && "📺"}
        </div>
        <div>
          <h3 className={`font-semibold text-sm ${platformStyle.textColor}`}>
            {account.platform === "Twitter"
              ? "X.com/gettoknowme"
              : account.platform === "GitHub"
                ? "Github.com/gettoknowme"
                : account.platform === "TikTok"
                  ? "tiktok.com/gettoknowme"
                  : account.platform === "YouTube"
                    ? "YouTube.com/gettoknowme"
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
                  src={post.image || "/placeholder.svg"}
                  alt="Instagram post"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-white text-xs text-center">
                    <div className="flex items-center gap-2">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {account.platform === "Twitter" && (
          <div className="space-y-2">
            {mockData?.recentPosts?.slice(0, gridHeight > 2 ? 3 : 2).map((post, index) => (
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
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>💬</span> {post.retweets}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>❤️</span> {post.likes}
                      </span>
                    </div>
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
                {Array.from({ length: 84 }, (_, i) => {
                  const intensity = Math.random()
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-sm ${
                        intensity > 0.8
                          ? "bg-green-500"
                          : intensity > 0.6
                            ? "bg-green-400"
                            : intensity > 0.4
                              ? "bg-green-300"
                              : intensity > 0.2
                                ? "bg-green-200"
                                : "bg-gray-700"
                      }`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-gray-300 text-center mb-2">1,247 contributions in the last year</p>
              <div className="flex justify-center gap-2">
                {mockData?.languages?.map((lang, index) => (
                  <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {account.platform === "TikTok" && (
          <div className="grid grid-cols-2 gap-2">
            {mockData?.recentVideos?.map((video, index) => (
              <div key={index} className="aspect-[3/4] relative group cursor-pointer">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt="TikTok video"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium bg-black/70 rounded px-2 py-1 truncate mb-1">
                    {video.title}
                  </p>
                  <p className="text-white text-xs bg-black/70 rounded px-2 py-0.5">{video.views} views</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-black text-sm">▶️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {account.platform === "YouTube" && (
          <div className="space-y-2">
            {mockData?.recentVideos?.map((video, index) => (
              <div key={index} className="flex gap-3 group cursor-pointer">
                <div className="w-20 h-12 relative flex-shrink-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt="YouTube video"
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetBase>
  )
}
