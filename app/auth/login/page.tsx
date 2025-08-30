"use client"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Github, Instagram, Twitter, UserX } from "lucide-react"

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

  const handleAnonymousLogin = async () => {
    const supabase = createClient()
    setIsLoading("anonymous")
    setError(null)

    try {
      const { error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      router.push("/dashboard")
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              onClick={handleAnonymousLogin}
              disabled={isLoading !== null}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <UserX className="w-5 h-5 mr-2" />
              {isLoading === "anonymous" ? "Connecting..." : "Continue Anonymously"}
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
