import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      headers: {
        "User-Agent": "get2knowme-app",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
