"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Github, UserIcon, Check, X, Twitter, Instagram } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [username, setUsername] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
          console.log("[v0] Showing username modal")
          setShowUsernameModal(true)
        } else {
          console.log("[v0] Redirecting to profile:", userData.username)
          router.push(`/${userData.username}?edit=true`)
        }
      }
    }
    checkUser()
  }, [router, supabase])

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setIsAvailable(null)
        return
      }

      setIsChecking(true)
      try {
        const { data } = await supabase.from("users").select("username").eq("username", username).single()
        setIsAvailable(!data)
      } catch (error) {
        setIsAvailable(true) // If no user found, username is available
      } finally {
        setIsChecking(false)
      }
    }

    const debounceTimer = setTimeout(checkUsername, 500)
    return () => clearTimeout(debounceTimer)
  }, [username, supabase])

  const handleSocialLogin = async (provider: "github") => {
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
          setShowUsernameModal(true)
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

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAvailable || isSubmitting) return

    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      console.log("[v0] Updating username to:", username)

      const { error: userError } = await supabase.from("users").update({ username }).eq("id", user.id)

      if (userError) {
        console.error("[v0] Error updating users table:", userError)
        throw userError
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: user.id,
        name: user.user_metadata?.full_name || username,
        bio: "Hey, this is my profile!",
      })

      if (profileError) {
        console.error("[v0] Error updating profiles table:", profileError)
        throw profileError
      }

      console.log("[v0] Username updated successfully, redirecting to:", `/${username}?edit=true`)
      setShowUsernameModal(false)
      router.push(`/${username}?edit=true`)
    } catch (error) {
      console.error("[v0] Error setting username:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalDismiss = async (open: boolean) => {
    if (!open) {
      // User is dismissing the modal, log them out
      console.log("[v0] User dismissed username modal, logging out")
      await supabase.auth.signOut()
      setShowUsernameModal(false)
    } else {
      setShowUsernameModal(open)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#9C8FB7]/20 via-[#9C8FB7]/10 to-[#9C8FB7]/30 flex items-center justify-center px-4 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 items-center lg:gap-[81px]">
            <div className="flex justify-center lg:justify-end w-min">
              <div className="w-80 h-80 bg-gradient-to-br from-[#9C8FB7] to-[#9C8FB7]/80 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 mx-14 mr-[0] ml-44">
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
                  disabled={true}
                  size="lg"
                  className="w-full text-lg py-6 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed border-0 shadow-lg flex items-center justify-center gap-3 relative"
                >
                  <Twitter className="w-5 h-5" />
                  Continue with X
                  <span className="absolute right-3 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </Button>

                <Button
                  disabled={true}
                  size="lg"
                  className="w-full text-lg py-6 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed border-0 shadow-lg flex items-center justify-center gap-3 relative"
                >
                  <Instagram className="w-5 h-5" />
                  Continue with Instagram
                  <span className="absolute right-3 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
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

      <Dialog open={showUsernameModal} onOpenChange={handleModalDismiss}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your Username</DialogTitle>
            <DialogDescription>This will be your unique identifier on get2knowme.app</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUsernameSubmit} className="space-y-4 my-2">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="pr-10"
                  minLength={3}
                  maxLength={20}
                />
                {isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!isChecking && isAvailable === true && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!isChecking && isAvailable === false && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>

              {username && (
                <p className="text-sm text-muted-foreground">
                  Your profile will be: get2knowme.app/<strong>{username}</strong>
                </p>
              )}

              {isAvailable === false && <p className="text-sm text-red-500">This username is already taken</p>}

              {isAvailable === true && <p className="text-sm text-green-500">This username is available!</p>}
            </div>

            <Button type="submit" className="w-full" disabled={!isAvailable || isSubmitting}>
              {isSubmitting ? "Creating Profile..." : "Continue"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
