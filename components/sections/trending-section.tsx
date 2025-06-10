"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TrendingSection() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Trends" },
    { id: "cottagecore", name: "Cottagecore" },
    { id: "y2k", name: "Y2K Revival" },
    { id: "minimalist", name: "Minimalist" },
    { id: "darkAcademia", name: "Dark Academia" },
  ]

  const trendingItems = [
    {
      id: "1",
      title: "Oversized Cotton Shirt",
      price: 49.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "minimalist",
      trending: true,
    },
    {
      id: "2",
      title: "Floral Maxi Dress",
      price: 79.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "cottagecore",
      trending: true,
    },
    {
      id: "3",
      title: "Vintage Denim Jacket",
      price: 89.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "y2k",
      trending: false,
    },
    {
      id: "4",
      title: "Tweed Blazer",
      price: 129.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "darkAcademia",
      trending: true,
    },
    {
      id: "5",
      title: "Platform Boots",
      price: 149.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "y2k",
      trending: true,
    },
    {
      id: "6",
      title: "Linen Trousers",
      price: 69.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "minimalist",
      trending: false,
    },
    {
      id: "7",
      title: "Knitted Cardigan",
      price: 59.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "cottagecore",
      trending: true,
    },
    {
      id: "8",
      title: "Oxford Shirt",
      price: 45.99,
      image: "/placeholder.svg?height=400&width=300",
      category: "darkAcademia",
      trending: false,
    },
  ]

  const filteredItems =
    activeCategory === "all" ? trendingItems : trendingItems.filter((item) => item.category === activeCategory)

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Hot Right Now</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 font-playfair">Trending Styles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover what's popular right now across different aesthetics and styles.
            </p>
          </div>
          <Link href="/trending" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2 group">
              View All Trends
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border hover:bg-muted"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background">
                  <Heart className="h-4 w-4" />
                </button>
                {item.trending && <Badge className="absolute top-3 left-3 bg-primary">Trending</Badge>}
              </div>
              <h3 className="font-medium line-clamp-1">{item.title}</h3>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
