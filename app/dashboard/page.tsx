"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchInput } from "@/components/search-input"
import { ProductGrid } from "@/components/product-grid"
import { Heart, Search, TrendingUp, Settings, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("recommendations")

  const recentSearches = [
    "Minimalist summer dresses",
    "Vintage leather jackets",
    "Bohemian accessories",
    "Streetwear sneakers",
  ]

  const savedMoodboards = [
    { id: 1, name: "Summer Vibes", items: 5, created: "2 days ago" },
    { id: 2, name: "Office Chic", items: 8, created: "1 week ago" },
    { id: 3, name: "Weekend Casual", items: 6, created: "2 weeks ago" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Niklas! 👋</h1>
            <p className="text-muted-foreground">Here's what's trending in your style</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mb-8">
        <SearchInput />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Saved Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Searches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Match Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Moodboards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">AI Recommendations for You</h2>
            <ProductGrid />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Button key={index} variant="ghost" className="w-full justify-start text-left h-auto p-2">
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Moodboards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Moodboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedMoodboards.map((moodboard) => (
                  <div key={moodboard.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{moodboard.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {moodboard.items} items • {moodboard.created}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/moodboard">Create New</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Style Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Your Style Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Minimalist</Badge>
                <Badge>Casual</Badge>
                <Badge>Vintage</Badge>
                <Badge>Streetwear</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
