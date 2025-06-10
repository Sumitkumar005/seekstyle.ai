import { ProductGrid } from "@/components/product-grid"
import { SearchFilters } from "@/components/search-filters"
import { SearchInput } from "@/components/search-input"

interface SearchPageProps {
  searchParams: {
    q?: string
    moodboard?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const isMoodboard = searchParams.moodboard === "true"

  // In a real app, we would fetch results based on the query or moodboard
  // For now, we'll use mock data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          {isMoodboard ? "Moodboard Results" : query ? `Results for "${query}"` : "Search Results"}
        </h1>
        <div className="max-w-2xl">
          <SearchInput />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <SearchFilters />
        </div>

        <div className="flex-1">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
