"use client"

import type React from "react"
import { useEffect } from "react"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import { Circle, X } from "lucide-react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from "react-native-reanimated"
import { useVideoRecording } from "../context/VideoRecordingContext"
import { formatDuration } from "../utils/formatters"

type FloatingRecordingIndicatorProps = {
  onPress?: () => void
}

export const FloatingRecordingIndicator: React.FC<FloatingRecordingIndicatorProps> = ({ onPress }) => {
  const { isRecording, recordingTime, stopRecording } = useVideoRecording()

  // Animation values
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)

  useEffect(() => {
    if (isRecording) {
      // Pulsing animation
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      )

      // Subtle scale animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      )
    } else {
      opacity.value = withTiming(0, { duration: 300 })
      scale.value = withTiming(0.8, { duration: 300 })
    }
  }, [isRecording, opacity, scale])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }
  })

  if (!isRecording) {
    return null
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity style={styles.indicator} onPress={onPress}>
        <Circle size={12} fill="#EF4444" color="#EF4444" />
        <Text style={styles.time}>{formatDuration(recordingTime)}</Text>

        <TouchableOpacity style={styles.stopButton} onPress={() => stopRecording()}>
          <X size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 1000,
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  time: {
    color: "white",
    marginLeft: 6,
    marginRight: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  stopButton: {
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
})
