"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
const lightTheme = {
  background: "#FFFFFF",
  foreground: "#1A1A1A",
  card: "#FFFFFF",
  cardForeground: "#1A1A1A",
  primary: "#22C55E",
  primaryForeground: "#FFFFFF",
  secondary: "#F3F4F6",
  secondaryForeground: "#1A1A1A",
  muted: "#F3F4F6",
  mutedForeground: "#71717A",
  accent: "#F3F4F6",
  accentForeground: "#1A1A1A",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  border: "#E5E7EB",
  input: "#E5E7EB",
  ring: "#22C55E",
}

const darkTheme = {
  background: "#121212",
  foreground: "#F9FAFB",
  card: "#1E1E1E",
  cardForeground: "#F9FAFB",
  primary: "#22C55E",
  primaryForeground: "#121212",
  secondary: "#27272A",
  secondaryForeground: "#F9FAFB",
  muted: "#27272A",
  mutedForeground: "#A1A1AA",
  accent: "#27272A",
  accentForeground: "#F9FAFB",
  destructive: "#7F1D1D",
  destructiveForeground: "#FEF2F2",
  border: "#27272A",
  input: "#27272A",
  ring: "#22C55E",
}

type ThemeContextType = {
  isDark: boolean
  colors: typeof darkTheme
  toggleTheme: () => void
  setDarkTheme: () => void
  setLightTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")
  const colors = isDark ? darkTheme : lightTheme

  useEffect(() => {
    // Always use dark theme for this app
    setIsDark(true)
  }, [])

  const toggleTheme = () => setIsDark(!isDark)
  const setDarkTheme = () => setIsDark(true)
  const setLightTheme = () => setIsDark(false)

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setDarkTheme, setLightTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
