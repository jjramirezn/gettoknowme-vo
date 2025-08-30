import { WidgetBase, type WidgetConfig } from "@/components/widget-base"

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
  return (
    <WidgetBase config={config} onConfigChange={onConfigChange} isEditMode={isEditMode}>
      <div className="flex items-center gap-4">
        <img
          src={profileData.avatar || "/placeholder.svg?height=80&width=80&query=profile photo"}
          alt={profileData.name}
          className="w-20 h-20 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{profileData.username}</h3>
          <p className="text-sm text-muted-foreground">Bio: {profileData.bio}</p>
        </div>
      </div>
    </WidgetBase>
  )
}
