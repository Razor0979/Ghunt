// This file provides a bridge between web APIs and native device sensors via Capacitor
import { Capacitor } from "@capacitor/core"

// Check if running in a native app context
export const isNative = () => {
  return Capacitor.isNativePlatform()
}

// Simulated sensor data for web preview
const simulateSensorData = () => {
  return {
    emf: Math.random() * 0.3 + 0.1,
    temperature: 20 + Math.random() * 5,
    pressure: 1010 + Math.random() * 10,
    humidity: 40 + Math.random() * 20,
    sound: 30 + Math.random() * 10,
  }
}

// In a real implementation, you would use Capacitor plugins to access device sensors
// For example, a magnetometer plugin for EMF readings
export const getSensorData = async () => {
  if (isNative()) {
    // Here you would use actual Capacitor plugins to get real sensor data
    // Example (pseudocode):
    // const emfData = await EMFPlugin.getCurrentReading();
    // const tempData = await TemperaturePlugin.getCurrentReading();
    // etc.

    // For now, return simulated data
    return simulateSensorData()
  } else {
    // Return simulated data for web preview
    return simulateSensorData()
  }
}

// Play a sound with fallback for native platforms
export const playSound = async (soundName: string) => {
  if (isNative()) {
    // Use native audio plugin
    // Example (pseudocode):
    // await AudioPlugin.play({ file: soundName });
    console.log(`Playing sound ${soundName} on native platform`)
    return true
  } else {
    // Web fallback
    try {
      const audio = new Audio(`/${soundName}`)
      await audio.play()
      return true
    } catch (error) {
      console.error("Failed to play audio:", error)
      return false
    }
  }
}

// Vibrate device (only works on native)
export const vibrate = (pattern: number[] = [200, 100, 200]) => {
  if (isNative()) {
    // Use Vibration API via Capacitor
    // Example (pseudocode):
    // await VibrationPlugin.vibrate({ pattern });
    console.log(`Vibrating device with pattern ${pattern}`)
    return true
  } else if ("vibrate" in navigator) {
    // Web Vibration API fallback
    navigator.vibrate(pattern)
    return true
  }
  return false
}
