import MoodboardBuilder from "@/components/moodboard-builder"

export default function MoodboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Moodboard</h1>
          <p className="text-muted-foreground">
            Combine up to 5 images to create a custom moodboard that represents your style aesthetic. Our AI will
            analyze your moodboard to find products that match your unique taste.
          </p>
        </div>

        <MoodboardBuilder />
      </div>
    </div>
  )
}
