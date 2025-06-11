"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Eye, Heart, Share2 } from "lucide-react"

const trendData = [
  { name: "Jan", cottagecore: 4000, y2k: 2400, minimalist: 2400, darkacademia: 1800 },
  { name: "Feb", cottagecore: 3000, y2k: 1398, minimalist: 2210, darkacademia: 2200 },
  { name: "Mar", cottagecore: 2000, y2k: 9800, minimalist: 2290, darkacademia: 2500 },
  { name: "Apr", cottagecore: 2780, y2k: 3908, minimalist: 2000, darkacademia: 2800 },
  { name: "May", cottagecore: 1890, y2k: 4800, minimalist: 2181, darkacademia: 3200 },
  { name: "Jun", cottagecore: 2390, y2k: 3800, minimalist: 2500, darkacademia: 3500 },
  { name: "Jul", cottagecore: 3490, y2k: 4300, minimalist: 2100, darkacademia: 3800 },
]

const viralProducts = [
  { name: "Coquette Bow Top", searches: 45000, growth: 89, sentiment: "positive" },
  { name: "Gorpcore Vest", searches: 38000, growth: 67, sentiment: "positive" },
  { name: "Y2K Cargo Pants", searches: 42000, growth: 78, sentiment: "positive" },
  { name: "Dark Academia Blazer", searches: 35000, growth: 34, sentiment: "neutral" },
  { name: "Coastal Linen Dress", searches: 28000, growth: 45, sentiment: "positive" },
]

const engagementData = [
  { name: "Mon", views: 12000, likes: 3400, shares: 1200 },
  { name: "Tue", views: 15000, likes: 4200, shares: 1800 },
  { name: "Wed", views: 18000, likes: 5100, shares: 2200 },
  { name: "Thu", views: 22000, likes: 6300, shares: 2800 },
  { name: "Fri", views: 28000, likes: 8100, shares: 3500 },
  { name: "Sat", views: 35000, likes: 10200, shares: 4200 },
  { name: "Sun", views: 32000, likes: 9800, shares: 3900 },
]

export function TrendingChart() {
  const [activeChart, setActiveChart] = useState("trends")

  return (
    <div className="space-y-8">
      {/* Chart Type Selector */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "trends", name: "Style Trends", icon: TrendingUp },
          { id: "viral", name: "Viral Products", icon: Activity },
          { id: "engagement", name: "Engagement", icon: Heart },
        ].map(({ id, name, icon: Icon }) => (
          <Button
            key={id}
            variant={activeChart === id ? "default" : "outline"}
            onClick={() => setActiveChart(id)}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            {name}
          </Button>
        ))}
      </div>

      {/* Charts */}
      {activeChart === "trends" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Style Trend Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cottagecore" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="y2k" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="minimalist" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="darkacademia" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Search Volume Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cottagecore"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Area type="monotone" dataKey="y2k" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="minimalist"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeChart === "viral" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Viral Product Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viralProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.searches.toLocaleString()} searches</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.sentiment === "positive" ? "default" : "secondary"}>
                        {product.growth > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {product.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeChart === "engagement" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Weekly Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8b5cf6" />
                  <Bar dataKey="likes" fill="#ec4899" />
                  <Bar dataKey="shares" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Total Views</span>
                  </div>
                  <span className="font-bold">162K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Total Likes</span>
                  </div>
                  <span className="font-bold">47.1K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-green-500" />
                    <span>Total Shares</span>
                  </div>
                  <span className="font-bold">19.6K</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  <div className="text-2xl font-bold text-green-600">41.2%</div>
                  <div className="text-xs text-green-600">+5.3% from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
