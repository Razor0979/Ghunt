"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import { Animated, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { X } from "lucide-react-native"
import { useTheme } from "./ThemeContext"

type ToastType = "success" | "error" | "warning" | "info" | "alert"

type Toast = {
  id: string
  title: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  showToast: (toast: Omit<Toast, "id">) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const { colors } = useTheme()

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        hideToast(id)
      }, toast.duration || 3000)
    }
  }

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => hideToast(toast.id)} colors={colors} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

const ToastItem: React.FC<{
  toast: Toast
  onDismiss: () => void
  colors: any
}> = ({ toast, onDismiss, colors }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    return () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [fadeAnim, translateY])

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return colors.primary
      case "error":
        return colors.destructive
      case "warning":
        return "#F59E0B"
      case "alert":
        return "#EF4444"
      default:
        return colors.secondary
    }
  }

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <View style={styles.toastContent}>
        <View style={styles.toastTextContainer}>
          <Text style={[styles.toastTitle, { color: colors.background }]}>{toast.title}</Text>
          <Text style={[styles.toastMessage, { color: colors.background }]}>{toast.message}</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    marginVertical: 5,
    width: "90%",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
  },
  dismissButton: {
    padding: 5,
  },
})

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
