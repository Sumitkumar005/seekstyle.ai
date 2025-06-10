"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterSection {
  id: string
  title: string
  expanded: boolean
  type: "checkbox" | "slider" | "color"
  options?: { id: string; label: string }[]
  range?: { min: number; max: number; step: number; value: [number, number] }
  colors?: { id: string; color: string; label: string }[]
}

export function SearchFilters() {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: "category",
      title: "Category",
      expanded: true,
      type: "checkbox",
      options: [
        { id: "tops", label: "Tops" },
        { id: "dresses", label: "Dresses" },
        { id: "bottoms", label: "Bottoms" },
        { id: "outerwear", label: "Outerwear" },
        { id: "shoes", label: "Shoes" },
        { id: "accessories", label: "Accessories" },
      ],
    },
    {
      id: "price",
      title: "Price Range",
      expanded: true,
      type: "slider",
      range: { min: 0, max: 500, step: 10, value: [0, 300] },
    },
    {
      id: "color",
      title: "Color",
      expanded: true,
      type: "color",
      colors: [
        { id: "black", color: "#000000", label: "Black" },
        { id: "white", color: "#FFFFFF", label: "White" },
        { id: "red", color: "#FF0000", label: "Red" },
        { id: "blue", color: "#0000FF", label: "Blue" },
        { id: "green", color: "#00FF00", label: "Green" },
        { id: "yellow", color: "#FFFF00", label: "Yellow" },
        { id: "purple", color: "#800080", label: "Purple" },
        { id: "pink", color: "#FFC0CB", label: "Pink" },
        { id: "brown", color: "#A52A2A", label: "Brown" },
      ],
    },
    {
      id: "brand",
      title: "Brand",
      expanded: false,
      type: "checkbox",
      options: [
        { id: "zara", label: "Zara" },
        { id: "hm", label: "H&M" },
        { id: "mango", label: "Mango" },
        { id: "asos", label: "ASOS" },
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
      ],
    },
    {
      id: "style",
      title: "Style",
      expanded: false,
      type: "checkbox",
      options: [
        { id: "casual", label: "Casual" },
        { id: "formal", label: "Formal" },
        { id: "bohemian", label: "Bohemian" },
        { id: "streetwear", label: "Streetwear" },
        { id: "vintage", label: "Vintage" },
        { id: "minimalist", label: "Minimalist" },
      ],
    },
  ])

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({
    category: [],
    price: [0, 300],
    color: [],
    brand: [],
    style: [],
  })

  const toggleSection = (id: string) => {
    setFilters(filters.map((filter) => (filter.id === id ? { ...filter, expanded: !filter.expanded } : filter)))
  }

  const toggleCheckbox = (sectionId: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const current = [...(prev[sectionId] || [])]
      const index = current.indexOf(optionId)

      if (index === -1) {
        current.push(optionId)
      } else {
        current.splice(index, 1)
      }

      return { ...prev, [sectionId]: current }
    })
  }

  const handleSliderChange = (sectionId: string, value: number[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [sectionId]: value,
    }))

    // Update the filter state to show the current value
    setFilters(
      filters.map((filter) =>
        filter.id === sectionId && filter.range
          ? { ...filter, range: { ...filter.range, value: value as [number, number] } }
          : filter,
      ),
    )
  }

  const toggleColor = (colorId: string) => {
    toggleCheckbox("color", colorId)
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      price: [0, 300],
      color: [],
      brand: [],
      style: [],
    })

    // Reset slider values
    setFilters(
      filters.map((filter) =>
        filter.type === "slider" && filter.range
          ? { ...filter, range: { ...filter.range, value: [filter.range.min, filter.range.max] } }
          : filter,
      ),
    )
  }

  return (
    <div className="sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-8">
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {filters.map((section) => (
          <div key={section.id} className="border-b pb-4">
            <button
              className="flex justify-between items-center w-full py-2 text-left font-medium"
              onClick={() => toggleSection(section.id)}
            >
              {section.title}
              {section.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {section.expanded && (
              <div className="mt-2">
                {section.type === "checkbox" && section.options && (
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <Checkbox
                          id={`${section.id}-${option.id}`}
                          checked={selectedFilters[section.id]?.includes(option.id)}
                          onCheckedChange={() => toggleCheckbox(section.id, option.id)}
                        />
                        <label htmlFor={`${section.id}-${option.id}`} className="ml-2 text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === "slider" && section.range && (
                  <div className="space-y-4 px-1 pt-4">
                    <Slider
                      min={section.range.min}
                      max={section.range.max}
                      step={section.range.step}
                      value={selectedFilters[section.id] || section.range.value}
                      onValueChange={(value) => handleSliderChange(section.id, value)}
                    />
                    <div className="flex justify-between text-sm">
                      <span>${selectedFilters[section.id]?.[0] || section.range.min}</span>
                      <span>${selectedFilters[section.id]?.[1] || section.range.max}</span>
                    </div>
                  </div>
                )}

                {section.type === "color" && section.colors && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {section.colors.map((color) => (
                      <button
                        key={color.id}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedFilters.color?.includes(color.id) ? "border-primary" : "border-transparent"
                        }`}
                        style={{
                          backgroundColor: color.color,
                          boxShadow: color.color === "#FFFFFF" ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none",
                        }}
                        onClick={() => toggleColor(color.id)}
                        title={color.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
