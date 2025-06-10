import { Camera, Palette, Heart, Sparkles } from "lucide-react"

export default function FeatureHighlights() {
  const features = [
    {
      icon: <Camera className="h-10 w-10 text-primary" />,
      title: "Image Search",
      description: "Upload photos or screenshots to find visually similar products that match your style.",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Moodboard Builder",
      description: "Create custom moodboards by combining multiple images to refine your aesthetic search.",
    },
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: "Personalized Recommendations",
      description: "Get better results over time as our AI learns your preferences and style.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "AI-Powered Discovery",
      description: "Our advanced algorithms understand visual aesthetics to find perfect style matches.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Discover Your Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-lg shadow-sm border flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
