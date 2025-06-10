import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"

// Mock product data - in a real app, this would come from an API or database
const mockProduct = {
  id: "1",
  title: "Oversized Cotton T-Shirt",
  price: 29.99,
  description:
    "A comfortable oversized t-shirt made from 100% organic cotton. Features a relaxed fit with dropped shoulders and a crew neckline. Perfect for everyday casual wear.",
  images: [
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
  ],
  retailer: "Zara",
  category: "tops",
  tags: ["casual", "minimalist"],
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: [
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#808080" },
  ],
}

export default function ProductPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the product data based on the ID
  const productId = params.id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/search?category=${mockProduct.category}`} className="hover:text-foreground capitalize">
            {mockProduct.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{mockProduct.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            <Image
              src={mockProduct.images[0] || "/placeholder.svg"}
              alt={mockProduct.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-md overflow-hidden bg-muted">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${mockProduct.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{mockProduct.title}</h1>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold">${mockProduct.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">From {mockProduct.retailer}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{mockProduct.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {mockProduct.sizes.map((size) => (
                <Button key={size} variant="outline" className="h-10 px-4">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-3">
              {mockProduct.colors.map((color) => (
                <button
                  key={color.name}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: color.value === "#FFFFFF" ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none",
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
            </Button>
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {mockProduct.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?style=${tag}`}
                  className="bg-muted px-3 py-1 rounded-full text-xs hover:bg-muted/80"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductGrid />
      </div>
    </div>
  )
}
