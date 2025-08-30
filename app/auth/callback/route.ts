import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const { data: profile } = await supabase.from("profiles").select("username").eq("user_id", data.user.id).single()

      if (!profile?.username || profile.username.startsWith("anon_")) {
        return NextResponse.redirect(`${origin}/username-setup`)
      } else {
        return NextResponse.redirect(`${origin}/${profile.username}?edit=true`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
