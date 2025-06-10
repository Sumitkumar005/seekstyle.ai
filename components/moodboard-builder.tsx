"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Move, Trash2, SearchIcon, ImagePlus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function MoodboardBuilder() {
  const [images, setImages] = useState<Array<{ id: string; url: string }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          id: Math.random().toString(36).substring(2, 9),
          url: URL.createObjectURL(file),
        }))

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
        .map((file) => ({
          id: Math.random().toString(36).substring(2, 9),
          url: URL.createObjectURL(file),
        }))

      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Limit to 5 images
    }
  }

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSearch = () => {
    if (images.length > 0) {
      // In a real app, we'd encode the images for the URL or use a state management solution
      router.push(`/search?moodboard=true`)
    }
  }

  const onDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const onDragEnd = () => {
    setDraggedItem(null)
  }

  const onDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      if (draggedItem && draggedItem !== targetId) {
        setImages((prevImages) => {
          const draggedIndex = prevImages.findIndex((img) => img.id === draggedItem)
          const targetIndex = prevImages.findIndex((img) => img.id === targetId)

          if (draggedIndex === -1 || targetIndex === -1) return prevImages

          const newImages = [...prevImages]
          const [removed] = newImages.splice(draggedIndex, 1)
          newImages.splice(targetIndex, 0, removed)

          return newImages
        })
      }
    },
    [draggedItem],
  )

  return (
    <div className="space-y-6">
      <div
        className={`border-2 ${isDragging ? "border-primary" : "border-dashed"} rounded-lg p-6 transition-all
          ${images.length === 0 ? "min-h-[300px]" : ""} flex flex-col items-center justify-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop images here</h3>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <Button onClick={triggerFileInput}>Upload Images</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full mb-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-square rounded-md overflow-hidden border ${
                    draggedItem === image.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={() => onDragStart(image.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => onDragOver(e, image.id)}
                >
                  <Image src={image.url || "/placeholder.svg"} alt="Moodboard image" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-black"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 text-black cursor-grab"
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  onClick={triggerFileInput}
                >
                  <ImagePlus className="h-8 w-8 mb-2" />
                  <span className="text-sm">Add Image</span>
                </button>
              )}
            </div>

            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setImages([])}>
                Clear All
              </Button>
              <Button onClick={handleSearch} disabled={images.length === 0} className="gap-2">
                <SearchIcon className="h-4 w-4" />
                Search with Moodboard
              </Button>
            </div>
          </>
        )}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-medium mb-2">Tips for creating an effective moodboard:</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Include images that represent your desired style aesthetic</li>
          <li>Mix different angles and perspectives for better results</li>
          <li>Add close-ups of textures, patterns, or details you like</li>
          <li>Include color palettes that match your preferred style</li>
          <li>Arrange images in order of importance (first image has highest priority)</li>
        </ul>
      </div>
    </div>
  )
}
