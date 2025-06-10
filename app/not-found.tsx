import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/search" className="gap-2">
              <Search className="w-4 h-4" />
              Search Products
            </Link>
          </Button>
        </div>

        <Button variant="ghost" asChild className="gap-2">
          <Link href="javascript:history.back()">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  )
}
