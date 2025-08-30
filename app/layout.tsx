import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "GetToKnowMe - Your Digital Identity Hub",
  description:
    "Centralize your online presence with GetToKnowMe - the modern platform for showcasing your digital identity",
  generator: "v0.app",
  other: {
    "tiktok-developers-site-verification": "guMkUVloN63rDFwIpGC0fqIkMDQptm6V",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="tiktok-developers-site-verification" content="guMkUVloN63rDFwIpGC0fqIkMDQptm6V" />
      </head>
      <body className={`font-sans ${inter.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
