import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/search-input"
import FeatureHighlights from "@/components/feature-highlights"
import HowItWorks from "@/components/how-it-works"
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Fashion Discovery
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Discover Fashion That Matches Your
              <span className="block">Unique Aesthetic</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Upload images, share Pinterest links, or describe your style. Our advanced AI will find the perfect
              products that match your unique taste from thousands of retailers.
            </p>

            <div className="w-full max-w-4xl mx-auto mb-12">
              <SearchInput />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              <Link href="/moodboard">
                <Button
                  size="lg"
                  className="gap-2 h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Brain className="w-5 h-5" />
                  Create AI Moodboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2 hover:bg-primary/5">
                  <Zap className="w-5 h-5 mr-2" />
                  Explore Styles
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="glass-effect rounded-2xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">10M+</div>
                <div className="text-muted-foreground">Products Analyzed</div>
              </div>
              <div className="glass-effect rounded-2xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">99.2%</div>
                <div className="text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="glass-effect rounded-2xl p-6">
                <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* How It Works */}
      <HowItWorks />
    </div>
  )
}
