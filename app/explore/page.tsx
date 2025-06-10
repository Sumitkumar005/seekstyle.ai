"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductGrid } from "@/components/product-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Heart, Sparkles } from "lucide-react"

const trendingStyles = [
  { id: "minimalist", name: "Minimalist", count: "2.3k items" },
  { id: "streetwear", name: "Streetwear", count: "1.8k items" },
  { id: "bohemian", name: "Bohemian", count: "1.5k items" },
  { id: "vintage", name: "Vintage", count: "2.1k items" },
  { id: "formal", name: "Formal", count: "1.2k items" },
  { id: "casual", name: "Casual", count: "3.4k items" },
]

const categories = [
  { id: "all", name: "All Categories", icon: "🌟" },
  { id: "tops", name: "Tops", icon: "👕" },
  { id: "dresses", name: "Dresses", icon: "👗" },
  { id: "bottoms", name: "Bottoms", icon: "👖" },
  { id: "outerwear", name: "Outerwear", icon: "🧥" },
  { id: "shoes", name: "Shoes", icon: "👟" },
  { id: "accessories", name: "Accessories", icon: "👜" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Explore Fashion
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Discover Your Next Favorite Style
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse curated collections, trending styles, and personalized recommendations powered by AI
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search styles, brands, or specific items..."
            className="pl-12 h-14 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="absolute right-2 top-2 h-10">Search</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trending" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="personalized" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            For You
          </TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Trending Styles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {trendingStyles.map((style) => (
                <Button
                  key={style.id}
                  variant={selectedStyle === style.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedStyle(selectedStyle === style.id ? "" : style.id)}
                >
                  <span className="font-medium">{style.name}</span>
                  <span className="text-xs text-muted-foreground">{style.count}</span>
                </Button>
              ))}
            </div>
          </div>
          <ProductGrid />
        </TabsContent>

        <TabsContent value="categories" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-auto p-6 flex flex-col items-center gap-3"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
          <ProductGrid />
        </TabsContent>

        <TabsContent value="personalized" className="space-y-8">
          <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl">
            <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Personalized Just for You</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in to see recommendations based on your style preferences and browsing history
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/signup">Create Account</a>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary">This Week</Badge>
              <Badge variant="outline">Last 7 Days</Badge>
              <Badge variant="outline">Fresh Drops</Badge>
            </div>
          </div>
          <ProductGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}
