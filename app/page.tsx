import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import NextLink from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Globe className="w-10 h-10 text-white" />
        </div>

        {/* Hero Image Placeholder */}
        <div className="w-64 h-64 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center shadow-xl">
          <div className="text-6xl">🌟</div>
        </div>

        {/* Catchy Tagline */}
        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4">
          Your Personal
          <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"> Homepage</span>
        </h1>

        <p className="text-xl text-muted-foreground text-balance mb-12 max-w-lg mx-auto">
          One link. All your socials. Pure vibes. ✨
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NextLink href="/auth/signup">
            <Button
              size="lg"
              className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
            >
              Get Started
            </Button>
          </NextLink>
          <NextLink href="/auth/login">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-12 py-6 rounded-full border-2 hover:bg-primary/5 transition-all bg-transparent"
            >
              Sign In
            </Button>
          </NextLink>
        </div>

        {/* Demo Link */}
        <div className="mt-8">
          <NextLink href="/alex" className="text-muted-foreground hover:text-primary transition-colors underline">
            Check out a demo profile
          </NextLink>
        </div>
      </div>
    </div>
  )
}
