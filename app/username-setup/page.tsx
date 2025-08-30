"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Check, X } from "lucide-react"

export default function UsernameSetup() {
  const [username, setUsername] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user already has a username
    async function checkExistingUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
        return
      }

      const { data: userData } = await supabase.from("users").select("username").eq("id", user.id).single()

      if (userData?.username && !userData.username.startsWith("anon_")) {
        router.push(`/${userData.username}`)
      }
    }

    checkExistingUser()
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      router.push(`/${username}?edit=true`)
    } catch (error) {
      console.error("[v0] Error setting username:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Username</CardTitle>
          <CardDescription>This will be your unique identifier on get2knowme.app</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 my-2">
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
        </CardContent>
      </Card>
    </div>
  )
}
