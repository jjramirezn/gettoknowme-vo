"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Copy,
  Share2,
  QrCode,
  Code,
  Eye,
  TrendingUp,
  ExternalLink,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Shield,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import NextLink from "next/link"

export default function ShareProfilePage() {
  const [profileUrl] = useState("https://gettoknowme.com/alexcreator")
  const [customMessage, setCustomMessage] = useState("Check out my profile on GetToKnowMe!")
  const [copied, setCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${profileUrl}/embed" width="300" height="400" frameborder="0"></iframe>`
    await navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(customMessage)
    const url = encodeURIComponent(profileUrl)

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
    }

    if (platform === "instagram") {
      alert("Copy your profile URL and share it in your Instagram bio or stories!")
      return
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
  }

  // Mock analytics data
  const analyticsData = {
    totalViews: "1,234",
    weeklyViews: "156",
    topReferrer: "Instagram",
    clickThroughRate: "12.5%",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/connect-accounts"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Accounts
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Share Profile</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Share Your Profile</h1>
          <p className="text-muted-foreground text-lg">Get your profile link and start sharing your digital identity</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Sharing Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Share Link</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="embed">Embed</TabsTrigger>
              </TabsList>

              {/* Share Link Tab */}
              <TabsContent value="link" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Your Profile URL
                    </CardTitle>
                    <CardDescription>
                      Copy and share this link anywhere to showcase your digital identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input value={profileUrl} readOnly className="flex-1" />
                      <Button onClick={handleCopyUrl} variant="outline">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customMessage">Custom Message</Label>
                      <Textarea
                        id="customMessage"
                        placeholder="Add a personal message when sharing..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial("twitter")}
                        className="flex items-center gap-2"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial("facebook")}
                        className="flex items-center gap-2"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial("linkedin")}
                        className="flex items-center gap-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial("instagram")}
                        className="flex items-center gap-2"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QR Code Tab */}
              <TabsContent value="qr" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      QR Code
                    </CardTitle>
                    <CardDescription>Let people scan this QR code to visit your profile instantly</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                      <img src="/qr-code.png" alt="QR Code" className="w-40 h-40" />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline">Download PNG</Button>
                      <Button variant="outline">Download SVG</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Perfect for business cards, flyers, or anywhere you need offline sharing
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Embed Tab */}
              <TabsContent value="embed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Embed Code
                    </CardTitle>
                    <CardDescription>Add your profile widget to any website or blog</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <code>
                        {`<iframe src="${profileUrl}/embed" width="300" height="400" frameborder="0"></iframe>`}
                      </code>
                    </div>
                    <Button onClick={handleCopyEmbed} className="w-full">
                      {embedCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {embedCopied ? "Copied!" : "Copy Embed Code"}
                    </Button>

                    {/* Preview */}
                    <div className="border rounded-lg p-4 bg-background">
                      <h4 className="font-medium mb-2">Preview</h4>
                      <div className="w-64 h-80 bg-muted rounded border mx-auto flex items-center justify-center text-sm text-muted-foreground">
                        Embedded Profile Widget
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/alexcreator">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <NextLink href="/privacy-settings">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </NextLink>
                <NextLink href="/payment-settings">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment Settings
                  </Button>
                </NextLink>
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
                <CardDescription>Your profile performance this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analyticsData.totalViews}</div>
                    <div className="text-xs text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{analyticsData.weeklyViews}</div>
                    <div className="text-xs text-muted-foreground">This Week</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Top Referrer</span>
                    <Badge variant="secondary">{analyticsData.topReferrer}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Click Rate</span>
                    <span className="font-medium">{analyticsData.clickThroughRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sharing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Add your profile link to all your social media bios</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  <p>Include it in your email signature for professional networking</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Use the QR code on business cards and printed materials</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
