import { WidgetBase, type WidgetConfig } from "@/components/widget-base"
import { Users, MapPin, Calendar } from "lucide-react"

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

interface ProfileWidgetProps {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  profileData: ProfileData
}

export function ProfileWidget({ config, onConfigChange, isEditMode, profileData }: ProfileWidgetProps) {
  const gridWidth = config.gridSize.width
  const gridHeight = config.gridSize.height

  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode}>
      {/* Widget Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm bg-primary">👤</div>
        <div>
          <h3 className="font-semibold text-sm">Profile</h3>
          <p className="text-xs text-muted-foreground">@{profileData.username}</p>
        </div>
      </div>

      <div className="space-y-3 h-full overflow-hidden">
        {/* Compact layout for small widgets */}
        {gridWidth === 1 && (
          <div className="text-center">
            <img
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              className="w-12 h-12 rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold text-sm truncate">{profileData.name}</h3>
          </div>
        )}

        {/* Medium layout */}
        {gridWidth === 2 && gridHeight === 1 && (
          <div className="flex items-center gap-3">
            <img
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              className="w-16 h-16 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{profileData.bio}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {profileData.followers}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profileData.location}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Large layout */}
        {gridWidth >= 2 && gridHeight >= 2 && (
          <div className="text-center space-y-3">
            <img
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              className="w-20 h-20 rounded-full mx-auto"
            />
            <div>
              <h3 className="font-bold text-xl mb-1">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{profileData.bio}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                  <Users className="w-4 h-4" />
                  <span className="truncate">{profileData.followers} followers</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 rounded bg-muted">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{profileData.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetBase>
  )
}
