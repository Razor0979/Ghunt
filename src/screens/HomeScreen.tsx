"use client"

import React, { useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  AlertCircle,
  BarChart3,
  FileText,
  Mic,
  Radio,
  Settings,
  Thermometer,
  Video,
  Volume2,
  Zap,
} from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { useSensors } from "../context/SensorContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card"
import { Button } from "../components/Button"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { sensorData, anomalyDetected, startMonitoring, stopMonitoring, isMonitoring } = useSensors()
  const [recording, setRecording] = React.useState(false)

  // Start monitoring when screen loads
  useEffect(() => {
    startMonitoring()
    return () => stopMonitoring()
  }, [startMonitoring, stopMonitoring])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
            <Zap size={16} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Scientific Anomaly Detection</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Settings" as never)}
          style={[styles.settingsButton, { borderColor: colors.border }]}
        >
          <Settings size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          <Card style={styles.card} anomaly={anomalyDetected}>
            <CardHeader>
              <View style={styles.cardTitleRow}>
                <CardTitle>Current Status</CardTitle>
                {anomalyDetected && <AlertCircle size={20} color="#EF4444" style={{ marginLeft: 8 }} />}
              </View>
              <CardDescription>Real-time environmental readings</CardDescription>
            </CardHeader>

            <CardContent>
              {anomalyDetected && (
                <View style={[styles.alertBanner, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                  <AlertCircle size={16} color="#EF4444" />
                  <Text style={[styles.alertText, { color: "#EF4444" }]}>Anomaly detected!</Text>
                </View>
              )}

              <View style={styles.sensorReadings}>
                <View style={styles.sensorRow}>
                  <View style={styles.sensorLabel}>
                    <Zap size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.sensorText, { color: colors.foreground }]}>EMF Reading:</Text>
                  </View>
                  <Text
                    style={[
                      styles.sensorValue,
                      { color: anomalyDetected && sensorData.emf > 0.35 ? "#EF4444" : colors.foreground },
                    ]}
                  >
                    {sensorData.emf.toFixed(2)} μT
                  </Text>
                </View>

                <View style={styles.sensorRow}>
                  <View style={styles.sensorLabel}>
                    <Thermometer size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.sensorText, { color: colors.foreground }]}>Temperature:</Text>
                  </View>
                  <Text
                    style={[
                      styles.sensorValue,
                      {
                        color:
                          anomalyDetected && Math.abs(sensorData.temperature - 21.3) > 0.5
                            ? "#EF4444"
                            : colors.foreground,
                      },
                    ]}
                  >
                    {sensorData.temperature.toFixed(1)}°C
                  </Text>
                </View>

                <View style={styles.sensorRow}>
                  <Text style={[styles.sensorText, { color: colors.foreground }]}>Barometric Pressure:</Text>
                  <Text style={[styles.sensorValue, { color: colors.foreground }]}>
                    {sensorData.pressure.toFixed(1)} hPa
                  </Text>
                </View>

                <View style={styles.sensorRow}>
                  <Text style={[styles.sensorText, { color: colors.foreground }]}>Humidity:</Text>
                  <Text style={[styles.sensorValue, { color: colors.foreground }]}>
                    {sensorData.humidity.toFixed(1)}%
                  </Text>
                </View>

                <View style={styles.sensorRow}>
                  <View style={styles.sensorLabel}>
                    <Volume2 size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.sensorText, { color: colors.foreground }]}>Sound Level:</Text>
                  </View>
                  <Text style={[styles.sensorValue, { color: colors.foreground }]}>
                    {sensorData.sound.toFixed(1)} dB
                  </Text>
                </View>
              </View>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                fullWidth
                onPress={() => navigation.navigate("Baseline" as never)}
                leftIcon={<BarChart3 size={16} color={colors.primary} />}
              >
                Establish Baseline
              </Button>
            </CardFooter>
          </Card>

          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start monitoring or recording</CardDescription>
            </CardHeader>

            <CardContent>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={[styles.quickAction, { borderColor: colors.border }]}
                  onPress={() => navigation.navigate("EMFScanner" as never)}
                >
                  <Zap size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.foreground }]}>EMF Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickAction, { borderColor: colors.border }]}
                  onPress={() => navigation.navigate("RadioFrequency" as never)}
                >
                  <Radio size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.foreground }]}>RF Monitor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickAction,
                    {
                      borderColor: recording ? colors.destructive : colors.border,
                      backgroundColor: recording ? "rgba(239, 68, 68, 0.1)" : "transparent",
                    },
                  ]}
                  onPress={() => {
                    if (recording) {
                      setRecording(false)
                    } else {
                      setRecording(true)
                      navigation.navigate("EVPSession" as never)
                    }
                  }}
                >
                  <Mic size={24} color={recording ? colors.destructive : colors.primary} />
                  <Text style={[styles.quickActionText, { color: recording ? colors.destructive : colors.foreground }]}>
                    {recording ? "Stop EVP" : "EVP Session"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickAction, { borderColor: colors.border }]}
                  onPress={() => navigation.navigate("Report" as never)}
                >
                  <BarChart3 size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.foreground }]}>Analysis</Text>
                </TouchableOpacity>
              </View>
            </CardContent>

            <CardFooter>
              <Button
                fullWidth
                onPress={() => navigation.navigate("Report" as never)}
                leftIcon={<FileText size={16} color={colors.primaryForeground} />}
              >
                Generate Report
              </Button>
            </CardFooter>
          </Card>
        </View>

        <Card style={styles.activityCard}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest recordings and anomalies</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={styles.activityList}>
              <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                <View style={styles.activityInfo}>
                  <AlertCircle size={16} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={[styles.activityText, { color: colors.foreground }]}>EMF Spike Detected</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>2 min ago</Text>
              </View>

              <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                <View style={styles.activityInfo}>
                  <Mic size={16} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.activityText, { color: colors.foreground }]}>EVP Session Recorded</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>15 min ago</Text>
              </View>

              <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
                <View style={styles.activityInfo}>
                  <Video size={16} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.activityText, { color: colors.foreground }]}>Video Recording Saved</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>1 hour ago</Text>
              </View>
            </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  gridContainer: {
    flexDirection: "column",
  },
  card: {
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertText: {
    marginLeft: 8,
    fontWeight: "500",
  },
  sensorReadings: {
    marginTop: 8,
  },
  sensorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sensorLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  sensorText: {
    fontSize: 14,
  },
  sensorValue: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: "48%",
    aspectRatio: 1.5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  activityCard: {
    marginBottom: 16,
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityText: {
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
  },
})
