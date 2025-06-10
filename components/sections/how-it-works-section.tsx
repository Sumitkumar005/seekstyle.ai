"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Images or Describe Your Style",
      description: "Share photos, Pinterest links, or describe your aesthetic in words.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      number: "02",
      title: "AI Analyzes Your Aesthetic",
      description: "Our advanced AI understands visual elements and style preferences.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      number: "03",
      title: "Discover Perfect Matches",
      description: "Browse curated products that match your unique style from multiple retailers.",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

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
          <h2 className="text-4xl font-bold mb-4 font-playfair">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered platform makes finding your perfect style simple and intuitive.
          </p>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="mb-6 inline-block text-sm font-semibold text-primary border border-primary rounded-full px-4 py-1">
                  {step.number}
                </div>
                <h3 className="text-3xl font-bold mb-4 font-playfair">{step.title}</h3>
                <p className="text-muted-foreground text-xl mb-6">{step.description}</p>

                {index === steps.length - 1 && (
                  <motion.div
                    className="flex items-center text-primary font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span>Start discovering</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                )}
              </div>

              <motion.div
                className="flex-1 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
