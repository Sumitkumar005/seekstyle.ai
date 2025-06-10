"use client"

import { motion } from "framer-motion"
import { Camera, Palette, Heart, Sparkles, Zap, Brain, Layers, Compass } from "lucide-react"

export function FeaturesSection() {
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
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Real-time Feedback",
      description: "Like, dislike, and refine results to continuously improve your search experience.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Style Analysis",
      description: "Get detailed insights about your aesthetic preferences and style patterns.",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Multi-retailer Search",
      description: "Find products across thousands of retailers in a single unified search experience.",
    },
    {
      icon: <Compass className="h-10 w-10 text-primary" />,
      title: "Trend Exploration",
      description: "Discover emerging fashion trends and aesthetics before they go mainstream.",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 font-playfair">Discover Your Style</h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered platform offers a suite of innovative features to help you find and define your unique
            aesthetic.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-background p-6 rounded-xl shadow-sm border flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
