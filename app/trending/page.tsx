"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { TrendingScrollScene } from "@/components/trending-scroll-scene"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, FlameIcon as Fire, Star, Eye, Heart, Share2, ArrowRight } from "lucide-react"

const trendingData = [
  {
    id: "1",
    title: "Coquette Aesthetic",
    description: "Feminine, romantic style with bows, pearls, and soft pastels taking over social media",
    growth: "+89%",
    searches: "234K",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["feminine", "romantic", "pastels", "bows"],
    color: "#ff69b4",
  },
  {
    id: "2",
    title: "Gorpcore Revolution",
    description: "Outdoor-inspired functional fashion meets high-end streetwear in urban settings",
    growth: "+67%",
    searches: "189K",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["outdoor", "functional", "technical", "urban"],
    color: "#32cd32",
  },
  {
    id: "3",
    title: "Y2K Cyber Fashion",
    description: "Metallic fabrics, holographic materials, and futuristic silhouettes dominate runways",
    growth: "+78%",
    searches: "203K",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["futuristic", "metallic", "cyber", "holographic"],
    color: "#00ffff",
  },
  {
    id: "4",
    title: "Coastal Grandmother",
    description: "Effortless linen pieces and neutral tones inspired by seaside living",
    growth: "+45%",
    searches: "156K",
    image: "/placeholder.svg?height=300&width=400",
    tags: ["coastal", "linen", "neutral", "relaxed"],
    color: "#f5deb3",
  },
]

const stats = [
  { label: "Active Trends", value: "127", change: "+12", icon: TrendingUp },
  { label: "Weekly Searches", value: "2.4M", change: "+18%", icon: Eye },
  { label: "Viral Products", value: "1,247", change: "+34", icon: Fire },
  { label: "Global Reach", value: "89K", change: "+7%", icon: Star },
]

export default function TrendingPage() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(window.scrollY)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* 3D Background Scene */}
      <TrendingScrollScene />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <Fire className="w-4 h-4 mr-2" />
                Live Trending Data
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white font-playfair">
                What's{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Trending
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Discover the hottest fashion trends, viral products, and emerging aesthetics powered by real-time AI
                analysis
              </p>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/20">
                Explore Trends <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center text-white"
                  >
                    <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-white/60 mb-2">{stat.label}</div>
                    <div className="text-xs text-green-400">{stat.change}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Trending Items */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-4 font-playfair">Hot Right Now</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                The most viral fashion trends taking over social media and runways worldwide
              </p>
            </motion.div>

            <div className="space-y-32">
              {trendingData.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <motion.div whileHover={{ scale: 1.02, rotateY: 5 }} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                      <Card className="relative bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img
                            src={trend.image || "/placeholder.svg"}
                            alt={trend.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge
                            className="absolute top-4 right-4 text-white border-0"
                            style={{ backgroundColor: trend.color }}
                          >
                            {trend.growth}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                      <Badge className="mb-4 bg-white/20 text-white">
                        <Fire className="w-3 h-3 mr-1" />
                        Trending #{index + 1}
                      </Badge>
                      <h3 className="text-4xl font-bold text-white mb-4 font-playfair">{trend.title}</h3>
                      <p className="text-lg text-white/80 mb-6 leading-relaxed">{trend.description}</p>

                      <div className="flex items-center gap-6 mb-6 text-white/60">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{trend.searches} searches</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{trend.growth} growth</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {trend.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-white border-white/20">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-12 border border-white/10 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4 font-playfair">Stay Ahead of Trends</h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Get personalized trend alerts and discover your next favorite style before it goes viral
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Get Trend Alerts <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
