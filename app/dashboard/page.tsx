import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Share2, Settings, Palette, Shield, CreditCard, Eye, Users, TrendingUp, ExternalLink } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your digital identity hub</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white border-0"
            >
              <Link href="/alex" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Public Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-pink-500" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-pink-200">
                  <AvatarImage src="/abstract-profile.png" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Alex Johnson</h3>
                  <p className="text-gray-600">@alexjohnson</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Digital creator passionate about tech, design, and coffee. Building the future one pixel at a time.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white border-0">
                      5 Connected Accounts
                    </Badge>
                    <Badge variant="outline" className="border-pink-200 text-pink-600">
                      Public Profile
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold text-pink-600">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Link Clicks</span>
                <span className="font-semibold text-pink-600">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Social Connections</span>
                <span className="font-semibold text-pink-600">5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/create-profile">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-pink-600 transition-colors">
                  <User className="h-5 w-5 text-pink-500" />
                  Edit Profile
                </CardTitle>
                <CardDescription>Update your personal information, bio, and profile picture</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/connect-accounts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-indigo-600 transition-colors">
                  <Settings className="h-5 w-5 text-indigo-500" />
                  Social Accounts
                </CardTitle>
                <CardDescription>Connect and manage your social media platforms</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/share-profile">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-pink-600 transition-colors">
                  <Share2 className="h-5 w-5 text-pink-500" />
                  Share Profile
                </CardTitle>
                <CardDescription>Generate links, QR codes, and share your profile</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/theme-customization">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-indigo-600 transition-colors">
                  <Palette className="h-5 w-5 text-indigo-500" />
                  Customize Theme
                </CardTitle>
                <CardDescription>Choose colors and styles to match your brand</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/privacy-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-pink-600 transition-colors">
                  <Shield className="h-5 w-5 text-pink-500" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control who can see your profile and content</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 group">
            <Link href="/payment-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg group-hover:text-indigo-600 transition-colors">
                  <CreditCard className="h-5 w-5 text-indigo-500" />
                  Payment Options
                </CardTitle>
                <CardDescription>Add donation links and payment methods</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest profile interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-lg border border-pink-100">
                <Eye className="h-4 w-4 text-pink-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile viewed by 23 people</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg border border-indigo-100">
                <Users className="h-4 w-4 text-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Connected Instagram account</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-lg border border-pink-100">
                <Palette className="h-4 w-4 text-pink-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Changed theme to Sunset Vibes</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
