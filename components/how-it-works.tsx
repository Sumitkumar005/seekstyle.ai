import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
            >
              <div className="flex-1">
                <div className="mb-4 inline-block text-sm font-semibold text-primary border border-primary rounded-full px-3 py-1">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg mb-6">{step.description}</p>

                {index === steps.length - 1 && (
                  <div className="flex items-center text-primary font-medium">
                    <span>Start discovering</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 relative h-[300px] w-full rounded-lg overflow-hidden">
                <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
