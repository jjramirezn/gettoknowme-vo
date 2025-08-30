import { WidgetBase, type WidgetConfig } from "@/components/widget-base"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, ExternalLink } from "lucide-react"

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
}

export function SocialWidget({ config, onConfigChange, isEditMode, account }: SocialWidgetProps) {
  const gridWidth = config.gridSize.width
  const gridHeight = config.gridSize.height

  // Enhanced mock data
  const ENHANCED_MOCK_DATA = {
    Instagram: {
      recentPosts: [
        { image: "/vibrant-coastal-sunset.png", likes: "2.1K", comments: "89", caption: "Golden hour magic ✨" },
        { image: "/steaming-coffee-cup.png", likes: "1.8K", comments: "67", caption: "Monday motivation ☕" },
        { image: "/vibrant-cityscape.png", likes: "3.2K", comments: "124", caption: "City lights never get old 🌃" },
        { image: "/abstract-profile.png", likes: "1.5K", comments: "43", caption: "Behind the scenes 📸" },
      ],
      stories: ["Travel", "Food", "Work", "Friends"],
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
      ],
    },
  }

  const mockData = ENHANCED_MOCK_DATA[account.platform as keyof typeof ENHANCED_MOCK_DATA]

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode}>
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

        {!isEditMode && (
          <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
            <a href={account.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-2 h-full overflow-hidden">
        {/* Small widget - just badge */}
        {gridWidth === 1 && (
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              {account.handle}
            </Badge>
          </div>
        )}

        {/* Medium widget - Instagram grid */}
        {gridWidth >= 2 && account.platform === "Instagram" && (
          <div className="space-y-2">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(gridWidth, 3)}, 1fr)` }}>
              {mockData?.recentPosts?.slice(0, gridWidth * Math.min(gridHeight, 2)).map((post, index) => (
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

        {/* Twitter posts */}
        {gridWidth >= 2 && account.platform === "Twitter" && (
          <div className="space-y-2">
            {mockData?.recentPosts?.slice(0, Math.max(1, gridHeight - 1)).map((post, index) => (
              <div key={index} className="border rounded-lg p-3 text-xs bg-accent/50">
                <p className="mb-2 leading-relaxed line-clamp-3">{post.text}</p>
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
                  </div>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">
                      Viral
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetBase>
  )
}
