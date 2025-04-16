"use client"

import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"

type CardProps = {
  children: React.ReactNode
  style?: ViewStyle
  anomaly?: boolean
}

export const Card: React.FC<CardProps> = ({ children, style, anomaly }) => {
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: anomaly ? "#EF4444" : colors.border,
          borderWidth: anomaly ? 2 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

type CardHeaderProps = {
  children?: React.ReactNode
  style?: ViewStyle
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
)

type CardTitleProps = {
  children: React.ReactNode
  style?: TextStyle
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const { colors } = useTheme()

  return <Text style={[styles.cardTitle, { color: colors.cardForeground }, style]}>{children}</Text>
}

type CardDescriptionProps = {
  children: React.ReactNode
  style?: TextStyle
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  const { colors } = useTheme()

  return <Text style={[styles.cardDescription, { color: colors.mutedForeground }, style]}>{children}</Text>
}

type CardContentProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
)

type CardFooterProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>{children}</View>
)

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
    paddingTop: 8,
  },
  cardFooter: {
    padding: 16,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
})
