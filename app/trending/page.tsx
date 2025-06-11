"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/product-grid"
import { TrendingChart } from "@/components/trending-chart"
import { TrendingHero3D } from "@/components/trending-hero-3d"
import { TrendingUp, FlameIcon as Fire, Star, Eye, Heart, Share2, Globe, Users } from "lucide-react"

const trendingCategories = [
  { id: "all", name: "All Trends", icon: "🌟" },
  { id: "cottagecore", name: "Cottagecore", icon: "🌸", growth: "+45%" },
  { id: "y2k", name: "Y2K Revival", icon: "✨", growth: "+67%" },
  { id: "minimalist", name: "Minimalist", icon: "⚪", growth: "+23%" },
  { id: "darkacademia", name: "Dark Academia", icon: "📚", growth: "+34%" },
  { id: "streetwear", name: "Streetwear", icon: "👟", growth: "+56%" },
  { id: "vintage", name: "Vintage", icon: "🕰️", growth: "+29%" },
]

const trendingStats = [
  { label: "Active Trends", value: "127", change: "+12", icon: TrendingUp },
  { label: "Weekly Searches", value: "2.4M", change: "+18%", icon: Eye },
  { label: "Viral Products", value: "1,247", change: "+34", icon: Fire },
  { label: "Style Influencers", value: "89K", change: "+7%", icon: Users },
]

const hotTrends = [
  {
    id: "1",
    name: "Coquette Aesthetic",
    description: "Feminine, romantic style with bows and pastels",
    growth: "+89%",
    searches: "234K",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["feminine", "romantic", "pastels", "bows"],
    trending: true,
  },
  {
    id: "2",
    name: "Gorpcore",
    description: "Outdoor-inspired functional fashion",
    growth: "+67%",
    searches: "189K",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["outdoor", "functional", "technical"],
    trending: true,
  },
  {
    id: "3",
    name: "Coastal Grandmother",
    description: "Relaxed, effortless coastal living style",
    growth: "+45%",
    searches: "156K",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["coastal", "relaxed", "linen", "neutral"],
    trending: false,
  },
  {
    id: "4",
    name: "Indie Sleaze",
    description: "Early 2000s indie music scene revival",
    growth: "+78%",
    searches: "203K",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["indie", "grunge", "vintage", "edgy"],
    trending: true,
  },
]

export default function TrendingPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("week")
  const [selectedTrend, setSelectedTrend] = useState(null)

  return (
    <div className="min-h-screen">
      {/* 3D Hero Section */}
      <TrendingHero3D />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {trendingStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-background border rounded-xl p-6 text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trending Now</h1>
            <p className="text-muted-foreground">Discover what's hot in fashion right now</p>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="trends" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends" className="gap-2">
              <Fire className="w-4 h-4" />
              Hot Trends
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Star className="w-4 h-4" />
              Viral Products
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="global" className="gap-2">
              <Globe className="w-4 h-4" />
              Global Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-8">
            {/* Category Filter */}
            <div className="flex overflow-x-auto pb-4 gap-4">
              {trendingCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  {category.growth && (
                    <Badge variant="secondary" className="text-xs">
                      {category.growth}
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Hot Trends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotTrends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTrend(trend)}
                >
                  <Card className="overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={trend.image || "/placeholder.svg"}
                        alt={trend.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      {trend.trending && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          <Fire className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {trend.growth}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{trend.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{trend.searches} searches</span>
                        <div className="flex gap-1">
                          <Heart className="w-3 h-3" />
                          <Share2 className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trend.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductGrid />
          </TabsContent>

          <TabsContent value="analytics">
            <TrendingChart />
          </TabsContent>

          <TabsContent value="global">
            <div className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Global Trends Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on bringing you trending styles from around the world.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
