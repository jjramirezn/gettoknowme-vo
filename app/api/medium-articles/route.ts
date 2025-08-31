import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    // Fetch RSS feed from Medium
    const rssUrl = `https://medium.com/feed/@${username}`
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const rssText = await response.text()

    // Parse RSS XML
    const articles = parseRSSFeed(rssText)

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching Medium articles:", error)
    return NextResponse.json({ error: "Failed to fetch Medium articles" }, { status: 500 })
  }
}

function parseRSSFeed(rssText: string) {
  // Simple RSS parser for Medium feeds
  const titleMatch = rssText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
  const descriptionMatch = rssText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)

  const title = titleMatch ? titleMatch[1] : "Medium Articles"
  const description = descriptionMatch ? descriptionMatch[1] : ""

  // Extract articles
  const itemRegex = /<item>(.*?)<\/item>/gs
  const items = rssText.match(itemRegex) || []

  const articles = items.slice(0, 10).map((item) => {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
    const linkMatch = item.match(/<link>(.*?)<\/link>/)
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)
    const creatorMatch = item.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/)
    const categoryMatches = item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g) || []

    const categories = categoryMatches
      .map((cat) => {
        const match = cat.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/)
        return match ? match[1] : ""
      })
      .filter(Boolean)

    return {
      title: titleMatch ? titleMatch[1] : "Untitled",
      link: linkMatch ? linkMatch[1] : "",
      pubDate: pubDateMatch ? pubDateMatch[1] : "",
      creator: creatorMatch ? creatorMatch[1] : "",
      categories: categories,
    }
  })

  return {
    title,
    description,
    articles,
  }
}
