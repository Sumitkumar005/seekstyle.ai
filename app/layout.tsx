import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AIChatbot } from "@/components/ai-chatbot"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "SeekStyle.ai | The Future of Fashion Discovery",
  description: "AI-powered fashion search engine that understands your aesthetic better than Google",
  keywords: "fashion, AI, search, style, discovery, moodboard, visual search",
  authors: [{ name: "SeekStyle.ai Team" }],
  openGraph: {
    title: "SeekStyle.ai | The Future of Fashion Discovery",
    description: "AI-powered fashion search engine that understands your aesthetic better than Google",
    url: "https://seekstyle.ai",
    siteName: "SeekStyle.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SeekStyle.ai - AI Fashion Discovery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekStyle.ai | The Future of Fashion Discovery",
    description: "AI-powered fashion search engine that understands your aesthetic better than Google",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <div className="relative flex min-h-screen flex-col">
                  {children}
                  <AIChatbot />
                </div>
                <Toaster />
              </AnalyticsProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
