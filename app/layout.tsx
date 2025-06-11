import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="main-content">{children}</div>
        <div className="three-canvas">
          {/* You might want to include a canvas element here, but it's not specified in the instructions */}
        </div>
      </body>
    </html>
  )
}
