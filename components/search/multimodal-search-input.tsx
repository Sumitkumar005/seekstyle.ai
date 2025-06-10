"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, X, ImageIcon, LinkIcon, Sparkles, Camera, Palette, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { searchAPI } from "@/lib/api"

interface SearchSuggestion {
  id: string
  text: string
  category: string
  trending?: boolean
}

const searchSuggestions: SearchSuggestion[] = [
  { id: "1", text: "minimalist summer dress", category: "style", trending: true },
  { id: "2", text: "vintage leather jacket", category: "style" },
  { id: "3", text: "cottagecore aesthetic", category: "vibe", trending: true },
  { id: "4", text: "dark academia outfit", category: "vibe" },
  { id: "5", text: "streetwear hoodie", category: "style" },
  { id: "6", text: "boho chic accessories", category: "style" },
]

export function MultimodalSearchInput() {
  const [query, setQuery] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [pinterestUrl, setPinterestUrl] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeMode, setActiveMode] = useState<"text" | "image" | "pinterest">("text")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim() && images.length === 0 && !pinterestUrl.trim()) {
      toast({
        title: "Search input required",
        description: "Please enter text, upload images, or provide a Pinterest link",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const searchData = {
        text: query,
        images: images,
        pinterest_url: pinterestUrl,
        mode: activeMode,
      }

      // Call API
      const results = await searchAPI.multimodalSearch(searchData)

      // Navigate to results
      const searchParams = new URLSearchParams({
        q: query,
        mode: activeMode,
        ...(images.length > 0 && { hasImages: "true" }),
        ...(pinterestUrl && { pinterest: pinterestUrl }),
      })

      router.push(`/search?${searchParams.toString()}`)
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...newImages].slice(0, 5))
      setActiveMode("image")
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...newImages].slice(0, 5))
      setActiveMode("image")
    }
  }, [])

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    if (images.length === 1) setActiveMode("text")
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    setActiveMode("text")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-muted/50 rounded-full p-1 glass-morphism">
          {[
            { mode: "text" as const, icon: Search, label: "Text" },
            { mode: "image" as const, icon: Camera, label: "Image" },
            { mode: "pinterest" as const, icon: LinkIcon, label: "Pinterest" },
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMode(mode)}
              className={`gap-2 transition-all duration-200 ${activeMode === mode ? "shadow-lg" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Search Container */}
      <motion.div
        layout
        className="relative bg-background/80 backdrop-blur-xl border-2 border-muted rounded-3xl p-6 shadow-2xl"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {activeMode === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Describe your style... (e.g., 'minimalist summer dress with cottagecore vibes')"
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus:ring-0 focus:border-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-2xl shadow-2xl z-50 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Popular Searches</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {searchSuggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted/50 text-left transition-colors"
                        >
                          <Palette className="w-4 h-4 text-primary" />
                          <span className="text-sm">{suggestion.text}</span>
                          {suggestion.trending && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              Trending
                            </Badge>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeMode === "image" && (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted"
                }`}
              >
                {images.length === 0 ? (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Style Images</h3>
                    <p className="text-muted-foreground mb-4">Drag and drop up to 5 images or click to browse</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Choose Images
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}

                      {images.length < 5 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                        >
                          <ImageIcon className="w-6 h-6 mb-2" />
                          <span className="text-xs">Add More</span>
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Find Similar Styles
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeMode === "pinterest" && (
            <motion.div
              key="pinterest"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="url"
                  placeholder="Paste Pinterest board or pin URL..."
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus:ring-0 focus:border-0"
                  value={pinterestUrl}
                  onChange={(e) => setPinterestUrl(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Paste any Pinterest URL and we'll analyze the aesthetic to find matching products</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6 gap-4"
      >
        {[
          { label: "Trending Now", emoji: "🔥" },
          { label: "Cottagecore", emoji: "🌸" },
          { label: "Dark Academia", emoji: "📚" },
          { label: "Y2K Revival", emoji: "✨" },
        ].map((tag, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuery(tag.label.toLowerCase())
              setActiveMode("text")
            }}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm hover:bg-muted transition-colors glass-morphism"
          >
            <span>{tag.emoji}</span>
            {tag.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}
