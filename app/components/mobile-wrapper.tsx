"use client"

import type React from "react"

import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"
import { StatusBar } from "@capacitor/status-bar"
import { SplashScreen } from "@capacitor/splash-screen"

interface MobileWrapperProps {
  children: React.ReactNode
}

export default function MobileWrapper({ children }: MobileWrapperProps) {
  useEffect(() => {
    // Initialize Capacitor plugins when running natively
    if (Capacitor.isNativePlatform()) {
      // Set status bar style
      StatusBar.setBackgroundColor({ color: "#121212" })
      StatusBar.setStyle({ style: "DARK" })

      // Hide splash screen after a delay
      setTimeout(() => {
        SplashScreen.hide()
      }, 1000)
    }
  }, [])

  return <div className="mobile-container">{children}</div>
}
