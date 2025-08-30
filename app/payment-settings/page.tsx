"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, CreditCard, Trash2, ExternalLink, DollarSign, Coffee, Wallet, ArrowRight } from "lucide-react"
import Link from "next/link"
import NextLink from "next/link"

interface PaymentLink {
  id: string
  platform: string
  url: string
  displayName: string
  icon: string
  color: string
  enabled: boolean
  customMessage?: string
}

const paymentPlatforms = [
  { id: "kofi", name: "Ko-fi", icon: "☕", color: "bg-blue-500", baseUrl: "https://ko-fi.com/" },
  { id: "paypal", name: "PayPal", icon: "💳", color: "bg-blue-600", baseUrl: "https://paypal.me/" },
  { id: "venmo", name: "Venmo", icon: "💰", color: "bg-blue-400", baseUrl: "https://venmo.com/" },
  { id: "cashapp", name: "Cash App", icon: "💵", color: "bg-green-500", baseUrl: "https://cash.app/" },
  { id: "patreon", name: "Patreon", icon: "🎨", color: "bg-orange-500", baseUrl: "https://patreon.com/" },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    icon: "☕",
    color: "bg-yellow-500",
    baseUrl: "https://buymeacoffee.com/",
  },
  { id: "github", name: "GitHub Sponsors", icon: "💻", color: "bg-gray-800", baseUrl: "https://github.com/sponsors/" },
  { id: "stripe", name: "Stripe", icon: "💎", color: "bg-purple-600", baseUrl: "https://buy.stripe.com/" },
]

export default function PaymentSettingsPage() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([
    {
      id: "1",
      platform: "kofi",
      url: "https://ko-fi.com/alexcreator",
      displayName: "Support my work",
      icon: "☕",
      color: "bg-blue-500",
      enabled: true,
      customMessage: "Buy me a coffee to support my content!",
    },
    {
      id: "2",
      platform: "paypal",
      url: "https://paypal.me/alexcreator",
      displayName: "Send a tip",
      icon: "💳",
      color: "bg-blue-600",
      enabled: true,
    },
  ])

  const [showPaymentSection, setShowPaymentSection] = useState(true)
  const [newPaymentForm, setNewPaymentForm] = useState({
    platform: "",
    username: "",
    displayName: "",
    customMessage: "",
  })

  const addPaymentLink = () => {
    if (!newPaymentForm.platform || !newPaymentForm.username) return

    const platform = paymentPlatforms.find((p) => p.id === newPaymentForm.platform)
    if (!platform) return

    const newLink: PaymentLink = {
      id: Date.now().toString(),
      platform: platform.id,
      url: platform.baseUrl + newPaymentForm.username,
      displayName: newPaymentForm.displayName || `Support on ${platform.name}`,
      icon: platform.icon,
      color: platform.color,
      enabled: true,
      customMessage: newPaymentForm.customMessage,
    }

    setPaymentLinks((prev) => [...prev, newLink])
    setNewPaymentForm({ platform: "", username: "", displayName: "", customMessage: "" })
  }

  const removePaymentLink = (id: string) => {
    setPaymentLinks((prev) => prev.filter((link) => link.id !== id))
  }

  const togglePaymentLink = (id: string) => {
    setPaymentLinks((prev) => prev.map((link) => (link.id === id ? { ...link, enabled: !link.enabled } : link)))
  }

  const updatePaymentLink = (id: string, field: string, value: string) => {
    setPaymentLinks((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const handleSaveSettings = () => {
    // TODO: Save payment settings to backend
    console.log("Payment settings saved:", { paymentLinks, showPaymentSection })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/privacy-settings"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Privacy
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-secondary-foreground" />
            </div>
            <span className="font-semibold">Payment Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment & Donations</h1>
          <p className="text-muted-foreground text-lg">
            Add payment links to monetize your content and receive support from your audience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Section Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Payment Section
                </CardTitle>
                <CardDescription>Control whether payment options appear on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Payment Options</Label>
                    <p className="text-sm text-muted-foreground">Display payment links on your public profile</p>
                  </div>
                  <Switch checked={showPaymentSection} onCheckedChange={setShowPaymentSection} />
                </div>
              </CardContent>
            </Card>

            {/* Current Payment Links */}
            {paymentLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Your Payment Links ({paymentLinks.length})
                  </CardTitle>
                  <CardDescription>Manage your existing payment and donation links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentLinks.map((link) => (
                    <div key={link.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center text-white text-lg`}
                          >
                            {link.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{link.displayName}</h4>
                            <p className="text-sm text-muted-foreground">{link.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={link.enabled} onCheckedChange={() => togglePaymentLink(link.id)} />
                          <Button variant="outline" size="sm" onClick={() => removePaymentLink(link.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {link.enabled && (
                        <div className="space-y-3 ml-13">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Display Name</Label>
                              <Input
                                value={link.displayName}
                                onChange={(e) => updatePaymentLink(link.id, "displayName", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">URL</Label>
                              <Input
                                value={link.url}
                                onChange={(e) => updatePaymentLink(link.id, "url", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Custom Message (Optional)</Label>
                            <Textarea
                              value={link.customMessage || ""}
                              onChange={(e) => updatePaymentLink(link.id, "customMessage", e.target.value)}
                              placeholder="Add a personal message for this payment option..."
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Add New Payment Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Payment Link
                </CardTitle>
                <CardDescription>Connect a new payment platform to receive support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <select
                      value={newPaymentForm.platform}
                      onChange={(e) => setNewPaymentForm((prev) => ({ ...prev, platform: e.target.value }))}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="">Select platform...</option>
                      {paymentPlatforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.icon} {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Username/Handle</Label>
                    <Input
                      value={newPaymentForm.username}
                      onChange={(e) => setNewPaymentForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="your-username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={newPaymentForm.displayName}
                    onChange={(e) => setNewPaymentForm((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Support my work"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Message (Optional)</Label>
                  <Textarea
                    value={newPaymentForm.customMessage}
                    onChange={(e) => setNewPaymentForm((prev) => ({ ...prev, customMessage: e.target.value }))}
                    placeholder="Add a personal message for supporters..."
                    rows={3}
                  />
                </div>

                <Button onClick={addPaymentLink} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Link
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Stats</CardTitle>
                <CardDescription>Your monetization overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{paymentLinks.filter((l) => l.enabled).length}</div>
                  <div className="text-sm text-muted-foreground">Active Payment Links</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Views</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Clicks</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span className="font-medium">7.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Platforms</CardTitle>
                <CardDescription>Most used by creators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentPlatforms.slice(0, 4).map((platform) => (
                  <div key={platform.id} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white text-sm`}
                    >
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{platform.name}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Monetization Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Add personal messages to increase conversion rates</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  <p>Use multiple payment options to cater to different preferences</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Keep payment links updated and test them regularly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save and Continue Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={handleSaveSettings} variant="outline" size="lg" className="px-8 bg-transparent">
            Save Payment Settings
          </Button>
          <NextLink href="/theme-customization">
            <Button size="lg" className="px-8">
              Continue to Themes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </NextLink>
        </div>
      </div>
    </div>
  )
}
