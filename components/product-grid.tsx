"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Oversized Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Zara",
    category: "tops",
    tags: ["casual", "minimalist"],
  },
  {
    id: "2",
    title: "High-Waisted Wide Leg Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "H&M",
    category: "bottoms",
    tags: ["casual", "vintage"],
  },
  {
    id: "3",
    title: "Floral Print Midi Dress",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Mango",
    category: "dresses",
    tags: ["bohemian", "formal"],
  },
  {
    id: "4",
    title: "Leather Biker Jacket",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "ASOS",
    category: "outerwear",
    tags: ["streetwear", "casual"],
  },
  {
    id: "5",
    title: "Canvas Sneakers",
    price: 45.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Nike",
    category: "shoes",
    tags: ["casual", "streetwear"],
  },
  {
    id: "6",
    title: "Structured Blazer",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Zara",
    category: "outerwear",
    tags: ["formal", "minimalist"],
  },
  {
    id: "7",
    title: "Pleated Midi Skirt",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "H&M",
    category: "bottoms",
    tags: ["formal", "vintage"],
  },
  {
    id: "8",
    title: "Chunky Knit Sweater",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Mango",
    category: "tops",
    tags: ["casual", "minimalist"],
  },
  {
    id: "9",
    title: "Crossbody Bag",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "ASOS",
    category: "accessories",
    tags: ["casual", "minimalist"],
  },
  {
    id: "10",
    title: "Platform Boots",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Adidas",
    category: "shoes",
    tags: ["streetwear", "vintage"],
  },
  {
    id: "11",
    title: "Satin Slip Dress",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "Zara",
    category: "dresses",
    tags: ["formal", "minimalist"],
  },
  {
    id: "12",
    title: "Denim Jacket",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    retailer: "H&M",
    category: "outerwear",
    tags: ["casual", "vintage"],
  },
]

export function ProductGrid() {
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const viewProduct = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Showing {mockProducts.length} results</p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] mb-2 overflow-hidden rounded-md bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <button
                className={`absolute top-2 right-2 p-1.5 rounded-full ${
                  favorites.includes(product.id) ? "bg-primary text-white" : "bg-background/80 text-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(product.id)
                }}
              >
                <Heart className="h-4 w-4" fill={favorites.includes(product.id) ? "currentColor" : "none"} />
              </button>
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer"
                onClick={() => viewProduct(product.id)}
              />
            </div>
            <div>
              <h3
                className="font-medium line-clamp-1 cursor-pointer hover:underline"
                onClick={() => viewProduct(product.id)}
              >
                {product.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{product.retailer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
