import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import MobileWrapper from "./components/mobile-wrapper"

export const metadata = {
  title: "Scientific Anomaly Detection System",
  description: "Advanced environmental monitoring and anomaly detection system",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MobileWrapper>
            {children}
            <Toaster />
          </MobileWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'