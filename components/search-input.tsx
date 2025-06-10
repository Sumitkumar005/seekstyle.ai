"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, X, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchInputProps {
  minimal?: boolean
}

export function SearchInput({ minimal = false }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || images.length > 0) {
      // In a real app, we'd encode the images and query for the URL
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Limit to 5 images
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Limit to 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`relative ${minimal ? "" : "p-2 bg-background border rounded-lg shadow-sm"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`flex items-center gap-2 ${isDragging ? "border-2 border-dashed border-primary p-2 rounded-md" : ""}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={minimal ? "Search..." : "Search by style, description, or paste a Pinterest link..."}
            className={`pl-10 ${minimal ? "h-9" : "h-12"}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {!minimal && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 flex-shrink-0"
            onClick={triggerFileInput}
          >
            <Upload className="h-5 w-5" />
            <span className="sr-only">Upload image</span>
          </Button>
        )}

        <Button type="submit" className={minimal ? "h-9 px-3" : "h-12 px-6"}>
          Search
        </Button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

      {!minimal && images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden border">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-background/80 rounded-bl-md p-0.5"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              className="h-16 w-16 border border-dashed rounded-md flex items-center justify-center text-muted-foreground"
              onClick={triggerFileInput}
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </form>
  )
}
