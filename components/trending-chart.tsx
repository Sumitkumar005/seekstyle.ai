"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const trendData = [
  { month: "Jan", coquette: 45, gorpcore: 32, y2k: 28, coastal: 25 },
  { month: "Feb", coquette: 52, gorpcore: 38, y2k: 35, coastal: 30 },
  { month: "Mar", coquette: 61, gorpcore: 45, y2k: 42, coastal: 35 },
  { month: "Apr", coquette: 73, gorpcore: 55, y2k: 48, coastal: 42 },
  { month: "May", coquette: 89, gorpcore: 67, y2k: 58, coastal: 48 },
  { month: "Jun", coquette: 95, gorpcore: 78, y2k: 72, coastal: 55 },
]

export function TrendingChart() {
  const [selectedTrend, setSelectedTrend] = useState("coquette")

  const trends = [
    { id: "coquette", name: "Coquette", color: "#ff69b4", growth: "+89%" },
    { id: "gorpcore", name: "Gorpcore", color: "#32cd32", growth: "+67%" },
    { id: "y2k", name: "Y2K", color: "#00ffff", growth: "+78%" },
    { id: "coastal", name: "Coastal", color: "#f5deb3", growth: "+45%" },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold mb-4">Trend Analytics</h2>
        <p className="text-muted-foreground">Real-time data showing fashion trend popularity over time</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {trends.map((trend) => (
          <motion.button
            key={trend.id}
            onClick={() => setSelectedTrend(trend.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border transition-all ${
              selectedTrend === trend.id ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            }`}
          >
            <div className="font-semibold">{trend.name}</div>
            <Badge variant="secondary" className="mt-1">
              {trend.growth}
            </Badge>
          </motion.button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {trends.map((trend) => (
                <Area
                  key={trend.id}
                  type="monotone"
                  dataKey={trend.id}
                  stroke={trend.color}
                  fill={trend.color}
                  fillOpacity={selectedTrend === trend.id ? 0.6 : 0.1}
                  strokeWidth={selectedTrend === trend.id ? 3 : 1}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
