import { Button } from "@/components/ui/button"
import NextLink from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30 flex items-center justify-center px-4 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-8xl font-black text-secondary drop-shadow-lg">ME</span>
            </div>
          </div>

          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              Show the world
              <br />
              <span className="text-primary">the real you.</span>
            </h1>

            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <NextLink href="/auth/login" className="block">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-6 rounded-full bg-white/90 hover:bg-white border-0 text-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  Sign in
                </Button>
              </NextLink>

              <NextLink href="/auth/signup" className="block">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-6 rounded-full bg-white/90 hover:bg-white border-0 text-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  Create account
                </Button>
              </NextLink>
            </div>

            <p className="text-sm text-muted-foreground max-w-md mx-auto lg:mx-0">
              By signing up, you agree to the{" "}
              <NextLink href="/terms" className="underline hover:text-primary transition-colors">
                Terms of Service
              </NextLink>{" "}
              and{" "}
              <NextLink href="/privacy" className="underline hover:text-primary transition-colors">
                Privacy Policy
              </NextLink>
              , including Cookie Use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
