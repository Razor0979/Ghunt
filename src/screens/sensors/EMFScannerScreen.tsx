"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Download, Radio, Zap } from "lucide-react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSensors } from "../../context/SensorContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/Card"
import { Button } from "../../components/Button"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated"

type HistoryItem = {
  id: string
  time: string
  value: number
}

export default function EMFScannerScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { playAlertSound, vibrate } = useSensors()

  const [scanning, setScanning] = useState(false)
  const [emfValue, setEmfValue] = useState(0.18)
  const [anomalyDetected, setAnomalyDetected] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Animation values
  const pulseOpacity = useSharedValue(0)
  const rotateValue = useSharedValue(0)

  // Setup animations
  useEffect(() => {
    rotateValue.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false)

    if (anomalyDetected) {
      pulseOpacity.value = withRepeat(withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true)
    } else {
      pulseOpacity.value = withTiming(0)
    }
  }, [anomalyDetected, rotateValue, pulseOpacity])

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    }
  })

  const radarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    }
  })

  // Simulate EMF scanning
  useEffect(() => {
    if (!scanning) return

    const interval = setInterval(() => {
      // Generate a random EMF value with occasional spikes
      const newValue =
        Math.random() < 0.1
          ? Math.random() * 0.8 + 0.5 // Spike (0.5-1.3)
          : Math.random() * 0.3 + 0.1 // Normal (0.1-0.4)

      setEmfValue(newValue)

      // Add to history
      const now = new Date()
      const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          time: timeString,
          value: newValue,
        },
        ...prev.slice(0, 19), // Keep last 20 readings
      ])

      // Check for anomaly
      if (newValue > 0.5 && !anomalyDetected) {
        setAnomalyDetected(true)

        // Play sound and vibrate
        playAlertSound()
        vibrate()

        // Reset anomaly flag after 3 seconds
        setTimeout(() => {
          setAnomalyDetected(false)
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [scanning, anomalyDetected, playAlertSound, vibrate])

  const getStatusColor = (value: number) => {
    if (value > 0.5) return "#EF4444" // Red
    if (value > 0.3) return "#F59E0B" // Yellow
    return "#22C55E" // Green
  }

  const getStatusText = (value: number) => {
    if (value > 0.5) return "Anomaly"
    if (value > 0.3) return "Elevated"
    return "Normal"
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

        <View style={styles.titleContainer}>
          <Zap size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.title, { color: colors.foreground }]}>EMF Scanner</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card} anomaly={anomalyDetected}>
          <CardHeader>
            <CardTitle>Electromagnetic Field Scanner</CardTitle>
            <CardDescription>Measures magnetic field fluctuations in μT (microTesla)</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={styles.emfDisplayContainer}>
              <View style={[styles.emfDisplay, { borderColor: colors.border }]}>
                <Animated.View style={[styles.radarSweep, { backgroundColor: `${colors.primary}20` }, radarStyle]} />

                <Animated.View
                  style={[
                    styles.anomalyPulse,
                    { backgroundColor: anomalyDetected ? `${colors.destructive}30` : "transparent" },
                    pulseStyle,
                  ]}
                />

                <View style={styles.emfValueContainer}>
                  <Text style={[styles.emfValue, { color: colors.foreground }]}>{emfValue.toFixed(3)}</Text>
                  <Text style={[styles.emfUnit, { color: colors.mutedForeground }]}>μT</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, emfValue * 100)}%`,
                        backgroundColor: getStatusColor(emfValue),
                      },
                    ]}
                  />
                </View>

                <View style={styles.progressLabels}>
                  <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>0.0</Text>
                  <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>0.5</Text>
                  <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>1.0</Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  variant={scanning ? "destructive" : "default"}
                  onPress={() => setScanning(!scanning)}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  {scanning ? "Stop Scanning" : "Start Scanning"}
                </Button>

                <Button variant="outline" leftIcon={<Download size={16} color={colors.primary} />} style={{ flex: 1 }}>
                  Save Data
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>Recent EMF measurements</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={[styles.historyContainer, { backgroundColor: colors.muted + "30" }]}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyHeaderText, { color: colors.mutedForeground }]}>Time</Text>
                <Text style={[styles.historyHeaderText, { color: colors.mutedForeground }]}>Reading (μT)</Text>
                <Text style={[styles.historyHeaderText, { color: colors.mutedForeground }]}>Status</Text>
              </View>

              {history.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Text style={[styles.emptyHistoryText, { color: colors.mutedForeground }]}>
                    No readings yet. Start scanning to collect data.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={history}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.historyTime, { color: colors.foreground }]}>{item.time}</Text>
                      <Text style={[styles.historyValue, { color: colors.foreground }]}>{item.value.toFixed(3)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.value) + "30" }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.value) }]}>
                          {getStatusText(item.value)}
                        </Text>
                      </View>
                    </View>
                  )}
                  style={styles.historyList}
                />
              )}
            </View>
          </CardContent>

          <CardFooter>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Normal range: 0.1-0.3 μT | Elevated: 0.3-0.5 μT | Anomaly: &gt;0.5 μT
            </Text>
          </CardFooter>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Radio Frequency Monitor</CardTitle>
            <CardDescription>Switch to RF monitoring</CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="outline"
              fullWidth
              leftIcon={<Radio size={16} color={colors.primary} />}
              onPress={() => navigation.navigate("RadioFrequency" as never)}
            >
              Switch to RF Monitor
            </Button>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  card: {
    marginBottom: 16,
  },
  emfDisplayContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emfDisplay: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  radarSweep: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 90,
  },
  anomalyPulse: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 90,
  },
  emfValueContainer: {
    alignItems: "center",
    zIndex: 10,
  },
  emfValue: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  emfUnit: {
    fontSize: 16,
    marginTop: 4,
  },
  progressBarContainer: {
    width: "100%",
    marginTop: 16,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  historyContainer: {
    borderRadius: 8,
    overflow: "hidden",
    height: 250,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  historyHeaderText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyHistory: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyHistoryText: {
    textAlign: "center",
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  historyTime: {
    fontSize: 14,
    flex: 1,
  },
  historyValue: {
    fontSize: 14,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footerText: {
    fontSize: 12,
  },
})
