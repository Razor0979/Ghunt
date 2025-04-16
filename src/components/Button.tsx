"use client"

import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  View,
} from "react-native"
import { useTheme } from "../context/ThemeContext"

type ButtonVariant = "default" | "destructive" | "outline" | "ghost"
type ButtonSize = "default" | "sm" | "lg" | "icon"

type ButtonProps = {
  children: React.ReactNode
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  leftIcon,
  rightIcon,
}) => {
  const { colors, isDark } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.muted

    switch (variant) {
      case "default":
        return colors.primary
      case "destructive":
        return colors.destructive
      case "outline":
      case "ghost":
        return "transparent"
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return colors.mutedForeground

    switch (variant) {
      case "default":
        return colors.primaryForeground
      case "destructive":
        return colors.destructiveForeground
      case "outline":
      case "ghost":
        return variant === "destructive" ? colors.destructive : colors.primary
      default:
        return colors.primaryForeground
    }
  }

  const getBorderColor = () => {
    if (disabled) return colors.muted

    switch (variant) {
      case "outline":
        return variant === "destructive" ? colors.destructive : colors.border
      default:
        return "transparent"
    }
  }

  const getPadding = () => {
    switch (size) {
      case "sm":
        return { paddingVertical: 6, paddingHorizontal: 12 }
      case "lg":
        return { paddingVertical: 12, paddingHorizontal: 24 }
      case "icon":
        return { padding: 8 }
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 }
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        getPadding(),
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

          {typeof children === "string" ? (
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: size === "sm" ? 14 : size === "lg" ? 18 : 16,
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}

          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
})
