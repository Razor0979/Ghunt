"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Platform, PermissionsAndroid } from "react-native"
import { useToast } from "./ToastContext"
import Sound from "react-native-sound"

// Initialize sound
Sound.setCategory("Playback")

type SensorData = {
  emf: number
  temperature: number
  pressure: number
  humidity: number
  sound: number
}

type SensorContextType = {
  sensorData: SensorData
  anomalyDetected: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  isMonitoring: boolean
  playAlertSound: () => void
  vibrate: () => void
}

const SensorContext = createContext<SensorContextType | undefined>(undefined)

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const [sensorData, setSensorData] = useState<SensorData>({
    emf: 0.2,
    temperature: 21.3,
    pressure: 1013.2,
    humidity: 45.7,
    sound: 32.4,
  })
  const [anomalyDetected, setAnomalyDetected] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alertSound, setAlertSound] = useState<Sound | null>(null)
  const [hasPermissions, setHasPermissions] = useState(false)

  // Request permissions
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ])

          const allGranted = Object.values(granted).every((status) => status === PermissionsAndroid.RESULTS.GRANTED)

          setHasPermissions(allGranted)

          if (!allGranted) {
            showToast({
              title: "Permission Required",
              message: "Some features may not work without required permissions",
              type: "warning",
            })
          }
        } catch (err) {
          console.warn(err)
          setHasPermissions(false)
        }
      } else {
        setHasPermissions(true)
      }
    }

    requestPermissions()
  }, [showToast])

  // Initialize sound
  useEffect(() => {
    const sound = new Sound("anomaly_beep.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load sound", error)
        return
      }
      // Sound loaded successfully
      sound.setVolume(1.0)
    })

    setAlertSound(sound)

    return () => {
      if (sound) {
        sound.release()
      }
    }
  }, [])

  // Simulate sensor readings
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Randomly update sensor values
      const newEmf = Math.max(0, sensorData.emf + (Math.random() - 0.5) * 0.1)
      const newTemp = Math.max(0, sensorData.temperature + (Math.random() - 0.5) * 0.2)

      setSensorData((prev) => ({
        emf: newEmf,
        temperature: newTemp,
        pressure: Math.max(0, prev.pressure + (Math.random() - 0.5) * 0.3),
        humidity: Math.max(0, prev.humidity + (Math.random() - 0.5) * 0.5),
        sound: Math.max(0, prev.sound + (Math.random() - 0.5) * 1.0),
      }))

      // Check for EMF anomaly
      const emfAnomaly = newEmf > 0.35
      // Check for temperature anomaly (sudden drop)
      const tempAnomaly = Math.abs(newTemp - sensorData.temperature) > 0.5

      // Simulate anomaly detection
      if ((emfAnomaly || tempAnomaly) && !anomalyDetected) {
        setAnomalyDetected(true)

        // Play sound and vibrate
        playAlertSound()
        vibrate()

        showToast({
          title: emfAnomaly ? "EMF Anomaly Detected!" : "Temperature Anomaly Detected!",
          message: emfAnomaly
            ? `Significant EMF fluctuation: ${newEmf.toFixed(2)} μT`
            : `Sudden temperature change: ${Math.abs(newTemp - sensorData.temperature).toFixed(1)}°C`,
          type: "alert",
        })

        // Reset anomaly after 5 seconds
        setTimeout(() => {
          setAnomalyDetected(false)
        }, 5000)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring, anomalyDetected, sensorData, showToast])

  const startMonitoring = () => {
    setIsMonitoring(true)
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
  }

  const playAlertSound = () => {
    if (alertSound) {
      alertSound.stop(() => {
        alertSound.play()
      })
    }
  }

  const vibrate = () => {
    if (Platform.OS === "android") {
      const ReactNativeVibration = require("react-native").Vibration
      ReactNativeVibration.vibrate([200, 100, 200])
    }
  }

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        anomalyDetected,
        startMonitoring,
        stopMonitoring,
        isMonitoring,
        playAlertSound,
        vibrate,
      }}
    >
      {children}
    </SensorContext.Provider>
  )
}

export const useSensors = () => {
  const context = useContext(SensorContext)
  if (context === undefined) {
    throw new Error("useSensors must be used within a SensorProvider")
  }
  return context
}
