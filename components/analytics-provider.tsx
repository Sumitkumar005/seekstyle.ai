"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type AnalyticsContextType = {
  trackEvent: (eventName: string, eventData?: any) => void
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
})

export const useAnalytics = () => useContext(AnalyticsContext)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, searchParams?.toString() || "")
    }
  }, [pathname, searchParams])

  const trackPageView = async (path: string, query: string) => {
    try {
      // Only track in production or when API is available
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics (dev):", { event_type: "page_view", page_path: path, page_query: query })
        return
      }

      // Check if API is available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        console.log("Analytics: API URL not configured")
        return
      }

      // Make API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${apiUrl}/api/analytics/track_event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "page_view",
          page_path: path,
          page_query: query,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      // Silently handle errors in production, log in development
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics tracking failed (this is normal in development):", error)
      }
    }
  }

  const trackEvent = async (eventName: string, eventData: any = {}) => {
    try {
      // Only track in production or when API is available
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics (dev):", { event_type: eventName, ...eventData })
        return
      }

      // Check if API is available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        return
      }

      // Make API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${apiUrl}/api/analytics/track_event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: eventName,
          ...eventData,
          page_path: pathname,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      // Silently handle errors in production, log in development
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics tracking failed (this is normal in development):", error)
      }
    }
  }

  return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>
}
