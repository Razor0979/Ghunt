"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  AppState,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Video, Circle, Pause, Clock, Trash2, Eye, Download } from "lucide-react-native"
import { Camera, useCameraDevices } from "react-native-vision-camera"
import { useTheme } from "../../context/ThemeContext"
import { useSensors } from "../../context/SensorContext"
import { useToast } from "../../context/ToastContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card"
import { Button } from "../../components/Button"
import { formatDuration } from "../../utils/formatters"
import { useVideoRecording } from "../../context/VideoRecordingContext"

const { width } = Dimensions.get("window")

export default function VideoRecordingScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { sensorData, anomalyDetected } = useSensors()
  const { showToast } = useToast()
  const { isRecording, startRecording, stopRecording, recordingTime, savedVideos } = useVideoRecording()

  const [hasPermission, setHasPermission] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [nightVision, setNightVision] = useState(true)
  const [isFrontCamera, setIsFrontCamera] = useState(false)

  const camera = useRef<Camera>(null)
  const devices = useCameraDevices()
  const device = isFrontCamera ? devices.front : devices.back
  const appState = useRef(AppState.currentState)

  // Request camera permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission()
      const microphonePermission = await Camera.requestMicrophonePermission()

      setHasPermission(cameraPermission === "authorized" && microphonePermission === "authorized")

      if (cameraPermission !== "authorized" || microphonePermission !== "authorized") {
        Alert.alert("Permissions Required", "Camera and microphone permissions are needed for video recording.", [
          { text: "OK" },
        ])
      }
    }

    requestPermissions()
  }, [])

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        // App is going to background
        if (isRecording) {
          showToast({
            title: "Recording in Background",
            message: "Video recording continues in the background",
            type: "info",
          })
        }
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [isRecording, showToast])

  // Handle anomaly detection during recording
  useEffect(() => {
    if (isRecording && anomalyDetected) {
      showToast({
        title: "Anomaly Detected During Recording!",
        message: "Potential paranormal activity detected while recording",
        type: "alert",
        duration: 5000,
      })
    }
  }, [anomalyDetected, isRecording, showToast])

  const handleStartRecording = async () => {
    if (camera.current && cameraReady) {
      try {
        startRecording(camera)
        showToast({
          title: "Recording Started",
          message: "Video recording has begun",
          type: "success",
        })
      } catch (error) {
        console.error("Failed to start recording:", error)
        showToast({
          title: "Recording Failed",
          message: "Could not start video recording",
          type: "error",
        })
      }
    }
  }

  const handleStopRecording = async () => {
    try {
      await stopRecording()
      showToast({
        title: "Recording Saved",
        message: "Video has been saved successfully",
        type: "success",
      })
    } catch (error) {
      console.error("Failed to stop recording:", error)
      showToast({
        title: "Error Saving Video",
        message: "Could not save the recording",
        type: "error",
      })
    }
  }

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera)
  }

  const toggleNightVision = () => {
    setNightVision(!nightVision)
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { borderColor: colors.border }]}
          >
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>Video Recording</Text>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.foreground }]}>
            Camera and microphone permissions are required for video recording.
          </Text>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </View>
      </View>
    )
  }

  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { borderColor: colors.border }]}
          >
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>Video Recording</Text>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.foreground }]}>Loading camera...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Video Recording</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            video={true}
            audio={true}
            enableZoomGesture
            onInitialized={() => setCameraReady(true)}
            colorSpace={nightVision ? "bt709" : "srgb"}
            lowLightBoost={nightVision}
          />

          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Circle size={12} fill="#EF4444" color="#EF4444" />
              <Text style={styles.recordingText}>{formatDuration(recordingTime)}</Text>
            </View>
          )}

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.background + "CC" }]}
              onPress={toggleCamera}
            >
              <Video size={20} color={colors.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.background + "CC" }]}
              onPress={toggleNightVision}
            >
              <Eye size={20} color={nightVision ? colors.primary : colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {isRecording ? (
            <Button
              variant="destructive"
              onPress={handleStopRecording}
              leftIcon={<Pause size={16} color="white" />}
              fullWidth
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              onPress={handleStartRecording}
              leftIcon={<Circle size={16} fill={colors.primaryForeground} color={colors.primaryForeground} />}
              fullWidth
            >
              Start Recording
            </Button>
          )}
        </View>

        <Card style={styles.sensorCard} anomaly={anomalyDetected}>
          <CardHeader>
            <CardTitle>Live Sensor Data</CardTitle>
            <CardDescription>Current environmental readings during recording</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={styles.sensorGrid}>
              <View style={[styles.sensorItem, { borderColor: colors.border }]}>
                <Text style={[styles.sensorLabel, { color: colors.mutedForeground }]}>EMF</Text>
                <Text
                  style={[
                    styles.sensorValue,
                    {
                      color: sensorData.emf > 0.35 ? colors.destructive : colors.foreground,
                    },
                  ]}
                >
                  {sensorData.emf.toFixed(2)} μT
                </Text>
              </View>

              <View style={[styles.sensorItem, { borderColor: colors.border }]}>
                <Text style={[styles.sensorLabel, { color: colors.mutedForeground }]}>Temp</Text>
                <Text style={[styles.sensorValue, { color: colors.foreground }]}>
                  {sensorData.temperature.toFixed(1)}°C
                </Text>
              </View>

              <View style={[styles.sensorItem, { borderColor: colors.border }]}>
                <Text style={[styles.sensorLabel, { color: colors.mutedForeground }]}>Sound</Text>
                <Text style={[styles.sensorValue, { color: colors.foreground }]}>{sensorData.sound.toFixed(1)} dB</Text>
              </View>
            </View>

            {anomalyDetected && (
              <View style={[styles.anomalyBanner, { backgroundColor: colors.destructive + "20" }]}>
                <Text style={[styles.anomalyText, { color: colors.destructive }]}>
                  Anomaly detected! Recording evidence...
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        <Card style={styles.savedVideosCard}>
          <CardHeader>
            <CardTitle>Saved Recordings</CardTitle>
            <CardDescription>Previous investigation videos</CardDescription>
          </CardHeader>

          <CardContent>
            {savedVideos.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No saved recordings yet. Start recording to capture evidence.
              </Text>
            ) : (
              <View style={styles.videoList}>
                {savedVideos.map((video, index) => (
                  <View key={video.id} style={[styles.videoItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.videoInfo}>
                      <Text style={[styles.videoName, { color: colors.foreground }]}>{video.name}</Text>
                      <View style={styles.videoMeta}>
                        <Clock size={12} color={colors.mutedForeground} style={{ marginRight: 4 }} />
                        <Text style={[styles.videoDate, { color: colors.mutedForeground }]}>
                          {video.date} • {formatDuration(video.duration)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.videoActions}>
                      <TouchableOpacity
                        style={[styles.videoAction, { backgroundColor: colors.muted }]}
                        onPress={() => {
                          /* Play video */
                        }}
                      >
                        <Video size={16} color={colors.foreground} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.videoAction, { backgroundColor: colors.muted }]}
                        onPress={() => {
                          /* Download/share video */
                        }}
                      >
                        <Download size={16} color={colors.foreground} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.videoAction, { backgroundColor: colors.destructive + "20" }]}
                        onPress={() => {
                          /* Delete video */
                        }}
                      >
                        <Trash2 size={16} color={colors.destructive} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
  cameraContainer: {
    width: "100%",
    height: width * 0.75, // 4:3 aspect ratio
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  recordingIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  recordingText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "500",
  },
  cameraControls: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "column",
    gap: 12,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    marginBottom: 16,
  },
  sensorCard: {
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sensorItem: {
    width: "30%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  sensorLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  anomalyBanner: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  anomalyText: {
    fontWeight: "500",
  },
  savedVideosCard: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 24,
  },
  videoList: {
    marginTop: 8,
  },
  videoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  videoInfo: {
    flex: 1,
  },
  videoName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoDate: {
    fontSize: 12,
  },
  videoActions: {
    flexDirection: "row",
    gap: 8,
  },
  videoAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
})
