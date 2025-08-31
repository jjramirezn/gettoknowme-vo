"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Github, Twitter, Instagram, UserIcon } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        console.log("[v0] User found:", user.id)
        const { data: userData, error } = await supabase.from("users").select("username").eq("id", user.id).single()

        console.log("[v0] User data:", userData)
        console.log("[v0] User error:", error)
        console.log("[v0] Username:", userData?.username)
        console.log("[v0] Starts with anon_:", userData?.username?.startsWith("anon_"))

        if (!userData?.username || userData.username.startsWith("anon_")) {
          console.log("[v0] Redirecting to username setup")
          router.push("/username-setup")
        } else {
          console.log("[v0] Redirecting to profile:", userData.username)
          router.push(`/${userData.username}?edit=true`)
        }
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSocialLogin = async (provider: "github" | "twitter" | "instagram") => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousLogin = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) throw error

      if (data.user) {
        console.log("[v0] Anonymous user logged in:", data.user.id)
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username")
          .eq("id", data.user.id)
          .single()

        console.log("[v0] Anonymous user data:", userData)
        console.log("[v0] Anonymous user error:", userError)
        console.log("[v0] Anonymous username:", userData?.username)

        if (!userData?.username || userData.username.startsWith("anon_")) {
          console.log("[v0] Anonymous user needs username setup")
          router.push("/username-setup")
        } else {
          console.log("[v0] Anonymous user has username, redirecting to profile:", userData.username)
          router.push(`/${userData.username}?edit=true`)
        }
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9C8FB7]/20 via-[#9C8FB7]/10 to-[#9C8FB7]/30 flex items-center justify-center px-4 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 items-center lg:gap-[81px]">
          <div className="flex justify-center lg:justify-end w-min">
            <div className="w-80 h-80 bg-gradient-to-br from-[#9C8FB7] to-[#9C8FB7]/80 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 mx-14">
              <span className="text-8xl font-black drop-shadow-lg" style={{ color: "#FFD54A" }}>
                ME
              </span>
            </div>
          </div>

          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              Show the world
              <br />
              <span className="text-[#9C8FB7]">the real you.</span>
            </h1>

            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <Button
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                size="lg"
                className="w-full text-lg py-6 rounded-full bg-white/90 hover:bg-white border-0 text-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </Button>

              <Button
                onClick={() => handleSocialLogin("twitter")}
                disabled={isLoading}
                size="lg"
                className="w-full text-lg py-6 rounded-full bg-white/90 hover:bg-white border-0 text-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Twitter className="w-5 h-5" />
                Continue with X
              </Button>

              <Button
                onClick={() => handleSocialLogin("instagram")}
                disabled={isLoading}
                size="lg"
                className="w-full text-lg py-6 rounded-full bg-white/90 hover:bg-white border-0 text-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Instagram className="w-5 h-5" />
                Continue with Instagram
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-[#9C8FB7]/20 via-[#9C8FB7]/10 to-[#9C8FB7]/30 px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAnonymousLogin}
                disabled={isLoading}
                size="lg"
                variant="outline"
                className="w-full text-lg py-6 rounded-full bg-white/50 hover:bg-white/70 border-white/30 text-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <UserIcon className="w-5 h-5" />
                Try Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground max-w-md mx-auto lg:mx-0">
              By signing up, you agree to the{" "}
              <a href="/terms" className="underline hover:text-[#9C8FB7] transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-[#9C8FB7] transition-colors">
                Privacy Policy
              </a>
              , including Cookie Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
