"use client"

import type React from "react"
import { useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated"
import { useTheme } from "../context/ThemeContext"

type SliderProps = {
  min?: number
  max?: number
  step?: number
  value?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  showLabels?: boolean
  labelFormatter?: (value: number) => string
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = min,
  onValueChange,
  disabled = false,
  showLabels = false,
  labelFormatter = (value) => `${value}`,
}) => {
  const { colors } = useTheme()
  const [localValue, setLocalValue] = useState(value)

  // Calculate the initial position
  const initialPosition = ((value - min) / (max - min)) * 100
  const position = useSharedValue(initialPosition)

  const updateValue = (pos: number) => {
    const newValue = min + (max - min) * (pos / 100)
    const steppedValue = Math.round(newValue / step) * step
    const clampedValue = Math.min(Math.max(steppedValue, min), max)

    setLocalValue(clampedValue)
    onValueChange?.(clampedValue)
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = position.value
    },
    onActive: (event, ctx) => {
      if (disabled) return

      const newPosition = ctx.startX + (event.translationX / 300) * 100
      position.value = Math.min(Math.max(newPosition, 0), 100)
      runOnJS(updateValue)(position.value)
    },
    onEnd: () => {
      position.value = withSpring(position.value)
    },
  })

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (position.value / 100) * 300 }],
    }
  })

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${position.value}%`,
    }
  })

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labelsContainer}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>{labelFormatter(min)}</Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>{labelFormatter(max)}</Text>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <View style={[styles.track, { backgroundColor: colors.muted }]} />

        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: disabled ? colors.mutedForeground : colors.primary },
            progressStyle,
          ]}
        />

        <PanGestureHandler onGestureEvent={gestureHandler} enabled={!disabled}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: disabled ? colors.mutedForeground : colors.primary,
                borderColor: colors.background,
              },
              thumbStyle,
            ]}
          />
        </PanGestureHandler>
      </View>

      {showLabels && (
        <Text style={[styles.valueLabel, { color: colors.foreground }]}>{labelFormatter(localValue)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4,
    width: "100%",
    borderRadius: 2,
    position: "absolute",
  },
  progress: {
    height: 4,
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    left: -10,
    borderWidth: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
  },
  valueLabel: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
})
