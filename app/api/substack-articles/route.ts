import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Fetch RSS feed from Substack URL + /feed
    const feedUrl = `${url}/feed`
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to extract articles
    const articles = parseSubstackRSS(xmlText)

    return NextResponse.json({
      title: extractTitle(xmlText) || "Substack Newsletter",
      description: extractDescription(xmlText) || "",
      articles: articles.slice(0, 10), // Limit to 10 most recent articles
    })
  } catch (error) {
    console.error("Error fetching Substack articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

function parseSubstackRSS(xmlText: string) {
  const articles: Array<{
    title: string
    link: string
    pubDate: string
    creator: string
    categories: string[]
  }> = []

  // Extract items using regex (simple XML parsing)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1]

    const title = extractXMLContent(itemContent, "title") || "Untitled"
    const link = extractXMLContent(itemContent, "link") || ""
    const pubDate = extractXMLContent(itemContent, "pubDate") || ""
    const creator = extractXMLContent(itemContent, "dc:creator") || extractXMLContent(itemContent, "author") || ""

    // Extract categories
    const categoryRegex = /<category[^>]*>(.*?)<\/category>/g
    const categories: string[] = []
    let categoryMatch
    while ((categoryMatch = categoryRegex.exec(itemContent)) !== null) {
      categories.push(categoryMatch[1].trim())
    }

    articles.push({
      title: title.trim(),
      link: link.trim(),
      pubDate: pubDate.trim(),
      creator: creator.trim(),
      categories,
    })
  }

  return articles
}

function extractXMLContent(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  const match = xml.match(regex)
  return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : null
}

function extractTitle(xmlText: string): string | null {
  return extractXMLContent(xmlText, "title")
}

function extractDescription(xmlText: string): string | null {
  return extractXMLContent(xmlText, "description")
}
