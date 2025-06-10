"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const testimonials = [
    {
      id: "1",
      name: "Emma Thompson",
      role: "Fashion Blogger",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "SeekStyle.ai has completely transformed how I discover new pieces for my wardrobe. The AI understands my aesthetic better than I do sometimes!",
      rating: 5,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Stylist",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "As a professional stylist, I need tools that save me time while delivering quality results. This platform is now an essential part of my workflow.",
      rating: 5,
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      role: "Fashion Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "I was always struggling to find clothes that matched my unique style. SeekStyle.ai understands exactly what I'm looking for, even when I can't describe it in words.",
      rating: 4,
    },
    {
      id: "4",
      name: "James Wilson",
      role: "Content Creator",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The moodboard feature is a game-changer for creating consistent aesthetics across my content. I can't imagine going back to traditional search methods.",
      rating: 5,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 font-playfair">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of fashion enthusiasts who have transformed their style discovery experience.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              initial={{ opacity: 1 }}
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <blockquote className="text-xl md:text-2xl font-medium mb-4 italic">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-primary" : "bg-muted-foreground/30"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
