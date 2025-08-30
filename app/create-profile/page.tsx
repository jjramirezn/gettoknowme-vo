"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, User, AtSign, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import NextLink from "next/link"

export default function CreateProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    profileImage: "",
  })
  const [step, setStep] = useState(1)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // TODO: Handle profile creation submission
    console.log("Profile created:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Create Profile</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AtSign className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Choose Your Username</CardTitle>
              <CardDescription>This will be your unique identifier on GetToKnowMe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    gettoknowme.com/
                  </span>
                  <Input
                    id="username"
                    placeholder="yourname"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-32"
                  />
                </div>
                {formData.username && (
                  <p className="text-sm text-muted-foreground">
                    Your profile will be available at: gettoknowme.com/{formData.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your Full Name"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!formData.username || !formData.displayName}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Picture */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Add Your Photo</CardTitle>
              <CardDescription>Upload a profile picture to help people recognize you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={imagePreview || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {formData.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center space-y-2">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose Photo
                    </div>
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground text-center">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Tell Your Story</CardTitle>
              <CardDescription>Write a bio that captures who you are and what you do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people about yourself, your interests, and what they can expect from your content..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground text-right">{formData.bio.length}/500 characters</p>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold mb-3">Preview</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={imagePreview || "/placeholder.svg"} />
                    <AvatarFallback>
                      {formData.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{formData.displayName || "Your Name"}</h4>
                      <Badge variant="secondary" className="text-xs">
                        @{formData.username || "username"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{formData.bio || "Your bio will appear here..."}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <NextLink href="/connect-accounts">
                  <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90">
                    Continue to Social Media
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </NextLink>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
