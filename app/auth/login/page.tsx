"use client"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Github, Instagram, Twitter } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSocialLogin = async (provider: "github" | "twitter" | "google") => {
    const supabase = createClient()
    setIsLoading(provider)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription>Connect with your social accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading !== null}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Github className="w-5 h-5 mr-2" />
              {isLoading === "github" ? "Connecting..." : "Continue with GitHub"}
            </Button>

            <Button
              onClick={() => handleSocialLogin("twitter")}
              disabled={isLoading !== null}
              className="w-full bg-black hover:bg-gray-900 text-white"
            >
              <Twitter className="w-5 h-5 mr-2" />
              {isLoading === "twitter" ? "Connecting..." : "Continue with X"}
            </Button>

            <Button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading !== null}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white"
            >
              <Instagram className="w-5 h-5 mr-2" />
              {isLoading === "google" ? "Connecting..." : "Continue with Instagram"}
            </Button>

            {/* TikTok button (using Google OAuth as placeholder since TikTok OAuth isn't widely supported) */}
            <Button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading !== null}
              className="w-full bg-black hover:bg-gray-900 text-white"
            >
              <div className="w-5 h-5 mr-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                T
              </div>
              {isLoading === "google" ? "Connecting..." : "Continue with TikTok"}
            </Button>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-pink-500 hover:text-pink-600 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
