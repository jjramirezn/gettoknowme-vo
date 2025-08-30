import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Link, Shield, Palette, Zap, Globe } from "lucide-react"
import NextLink from "next/link"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GetToKnowMe</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <NextLink href="/create-profile">
              <Button size="sm">Get Started</Button>
            </NextLink>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          <Zap className="w-3 h-3 mr-1" />
          Now in Beta
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Your Digital Identity,
          <span className="text-primary"> Simplified</span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
          Centralize your online presence with GetToKnowMe. One link to showcase all your social media, content, and
          digital identity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NextLink href="/create-profile">
            <Button size="lg" className="text-lg px-8">
              Create Your Profile
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </NextLink>
          <NextLink href="/alex">
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Demo
            </Button>
          </NextLink>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Powerful features designed for creators, influencers, and professionals who want to make an impact online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Link className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Social Media Integration</CardTitle>
              <CardDescription>
                Connect all your social platforms and showcase your content in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Content Aggregation</CardTitle>
              <CardDescription>
                Automatically display your most engaging posts from all connected platforms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>
                Full control over who sees your content with customizable privacy settings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                <Palette className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>Personalize your profile with custom themes that reflect your style</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Payment Integration</CardTitle>
              <CardDescription>Add donation links and payment options to monetize your content</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Crypto Integration</CardTitle>
              <CardDescription>Connect your Ethereum identity and showcase your Web3 presence</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Get started in minutes and create your digital identity hub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your profile with your bio, profile picture, and basic information
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Accounts</h3>
              <p className="text-muted-foreground">Link your social media accounts and other online platforms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
              <p className="text-muted-foreground">
                Get your unique link and start sharing your centralized digital identity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are already using GetToKnowMe to showcase their digital identity
        </p>
        <NextLink href="/create-profile">
          <Button size="lg" className="text-lg px-8">
            Create Your Profile Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </NextLink>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
