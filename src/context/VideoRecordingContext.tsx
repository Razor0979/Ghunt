"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import { AppState } from "react-native"
import type { Camera } from "react-native-vision-camera"
import { useToast } from "./ToastContext"

type VideoFile = {
  id: string
  path: string
  name: string
  date: string
  duration: number
  size?: number
  hasAnomaly?: boolean
}

type VideoRecordingContextType = {
  isRecording: boolean
  recordingTime: number
  savedVideos: VideoFile[]
  startRecording: (cameraRef: React.RefObject<Camera>) => Promise<void>
  stopRecording: () => Promise<void>
  deleteVideo: (id: string) => void
  playVideo: (id: string) => void
  exportVideo: (id: string) => Promise<boolean>
}

const VideoRecordingContext = createContext<VideoRecordingContextType | undefined>(undefined)

export const VideoRecordingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [savedVideos, setSavedVideos] = useState<VideoFile[]>([
    {
      id: "1",
      path: "/storage/emulated/0/DCIM/GhostHunter/video_20250415_213045.mp4",
      name: "Living Room Investigation",
      date: "Apr 15, 2025",
      duration: 124,
      hasAnomaly: true,
    },
    {
      id: "2",
      path: "/storage/emulated/0/DCIM/GhostHunter/video_20250414_190512.mp4",
      name: "Basement Session",
      date: "Apr 14, 2025",
      duration: 305,
      hasAnomaly: false,
    },
  ])

  const cameraRef = useRef<React.RefObject<Camera> | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const appState = useRef(AppState.currentState)

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active" && isRecording) {
        // App came back to foreground while recording
        showToast({
          title: "Recording Active",
          message: `Recording in progress: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")}`,
          type: "info",
        })
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [isRecording, recordingTime, showToast])

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setRecordingTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const startRecording = async (camera: React.RefObject<Camera>) => {
    try {
      cameraRef.current = camera

      if (camera.current) {
        await camera.current.startRecording({
          onRecordingFinished: (video) => {
            // This will be called when stopRecording is called
            const newVideo: VideoFile = {
              id: Date.now().toString(),
              path: video.path,
              name: `Investigation ${new Date().toLocaleDateString()}`,
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              duration: recordingTime,
              size: video.size,
              hasAnomaly: Math.random() > 0.5, // Simulated anomaly detection
            }

            setSavedVideos((prev) => [newVideo, ...prev])
          },
          onRecordingError: (error) => {
            console.error("Recording error:", error)
            showToast({
              title: "Recording Error",
              message: "An error occurred during recording",
              type: "error",
            })
            setIsRecording(false)
          },
        })

        setIsRecording(true)
      }
    } catch (error) {
      console.error("Failed to start recording:", error)
      throw error
    }
  }

  const stopRecording = async () => {
    try {
      if (cameraRef.current?.current) {
        await cameraRef.current.current.stopRecording()
      }
      setIsRecording(false)
      return true
    } catch (error) {
      console.error("Failed to stop recording:", error)
      setIsRecording(false)
      throw error
    }
  }

  const deleteVideo = (id: string) => {
    // In a real app, you would also delete the file from the file system
    setSavedVideos((prev) => prev.filter((video) => video.id !== id))

    showToast({
      title: "Video Deleted",
      message: "Recording has been deleted",
      type: "info",
    })
  }

  const playVideo = (id: string) => {
    // In a real app, you would navigate to a video player screen
    const video = savedVideos.find((v) => v.id === id)

    if (video) {
      showToast({
        title: "Playing Video",
        message: `Playing: ${video.name}`,
        type: "info",
      })
    }
  }

  const exportVideo = async (id: string): Promise<boolean> => {
    // In a real app, you would implement sharing or exporting functionality
    const video = savedVideos.find((v) => v.id === id)

    if (video) {
      showToast({
        title: "Exporting Video",
        message: `Exporting: ${video.name}`,
        type: "success",
      })
      return true
    }

    return false
  }

  return (
    <VideoRecordingContext.Provider
      value={{
        isRecording,
        recordingTime,
        savedVideos,
        startRecording,
        stopRecording,
        deleteVideo,
        playVideo,
        exportVideo,
      }}
    >
      {children}
    </VideoRecordingContext.Provider>
  )
}

export const useVideoRecording = () => {
  const context = useContext(VideoRecordingContext)
  if (context === undefined) {
    throw new Error("useVideoRecording must be used within a VideoRecordingProvider")
  }
  return context
}
