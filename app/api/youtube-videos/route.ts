import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get("channel")

  if (!channel) {
    return NextResponse.json({ error: "Channel parameter is required" }, { status: 400 })
  }

  try {
    // Fetch RSS feed from OpenRSS
    const rssUrl = `https://openrss.org/www.youtube.com/${channel}/videos`
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to extract video information
    const videos = parseYouTubeRSS(xmlText)

    return NextResponse.json({
      videos,
      channelName: channel,
    })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
  }
}

function parseYouTubeRSS(xmlText: string) {
  const videos: any[] = []

  try {
    // Extract video entries using regex (simple XML parsing)
    const entryRegex = /<entry>(.*?)<\/entry>/gs
    const entries = xmlText.match(entryRegex) || []

    for (const entry of entries) {
      const titleMatch = entry.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const linkMatch = entry.match(/<link href="(.*?)"/)
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const thumbnailMatch = entry.match(/<media:thumbnail url="(.*?)"/)

      if (titleMatch && linkMatch && publishedMatch) {
        videos.push({
          title: titleMatch[1],
          link: linkMatch[1],
          publishedAt: publishedMatch[1],
          thumbnail: thumbnailMatch ? thumbnailMatch[1] : null,
        })
      }
    }
  } catch (error) {
    console.error("Error parsing YouTube RSS:", error)
  }

  return videos
}
