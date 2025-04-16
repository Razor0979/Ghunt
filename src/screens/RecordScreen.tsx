"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Mic, Video, FileText, Beaker } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card"
import { Button } from "../components/Button"
import { useVideoRecording } from "../context/VideoRecordingContext"

export default function RecordScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { isRecording, startRecording } = useVideoRecording()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Recording Tools</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Recording Tools</CardTitle>
            <CardDescription>Capture audio, video, and EVP sessions</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={styles.recordingGrid}>
              <TouchableOpacity
                style={[styles.recordingOption, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate("EVPSession" as never)}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
                  <Mic size={32} color={colors.primary} />
                </View>
                <Text style={[styles.optionTitle, { color: colors.foreground }]}>EVP Session</Text>
                <Text style={[styles.optionDescription, { color: colors.mutedForeground }]}>
                  Record electronic voice phenomena
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.recordingOption,
                  {
                    backgroundColor: colors.card,
                    borderColor: isRecording ? colors.destructive : colors.border,
                    borderWidth: isRecording ? 2 : 1,
                  },
                ]}
                onPress={() => navigation.navigate("VideoRecording" as never)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isRecording ? colors.destructive + "20" : colors.primary + "20" },
                  ]}
                >
                  <Video size={32} color={isRecording ? colors.destructive : colors.primary} />
                </View>
                <Text style={[styles.optionTitle, { color: isRecording ? colors.destructive : colors.foreground }]}>
                  {isRecording ? "Recording Active" : "Video Recording"}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.mutedForeground }]}>
                  {isRecording ? "Tap to view current recording" : "Capture visual evidence"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.experimentContainer}>
              <Card style={styles.experimentCard}>
                <CardHeader>
                  <CardTitle>Controlled Experiment</CardTitle>
                  <CardDescription>Scientific investigation protocols</CardDescription>
                </CardHeader>

                <CardContent>
                  <View style={styles.experimentContent}>
                    <Beaker size={32} color={colors.primary} style={styles.experimentIcon} />
                    <Text style={[styles.experimentText, { color: colors.foreground }]}>
                      Set up a controlled experiment with double-blind protocols where researchers don't know when
                      recording is happening.
                    </Text>
                  </View>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" fullWidth>
                    Setup Experiment
                  </Button>
                </CardFooter>
              </Card>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
            <CardDescription>Access your saved investigation data</CardDescription>
          </CardHeader>

          <CardContent>
            <View style={styles.recentList}>
              <View style={[styles.recentItem, { borderBottomColor: colors.border }]}>
                <View style={styles.recentInfo}>
                  <View style={[styles.recentIcon, { backgroundColor: colors.primary + "20" }]}>
                    <Mic size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.recentTitle, { color: colors.foreground }]}>EVP Session #1</Text>
                    <Text style={[styles.recentMeta, { color: colors.mutedForeground }]}>2:04 - Apr 15, 2025</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  Play
                </Button>
              </View>

              <View style={[styles.recentItem, { borderBottomColor: colors.border }]}>
                <View style={styles.recentInfo}>
                  <View style={[styles.recentIcon, { backgroundColor: colors.primary + "20" }]}>
                    <Video size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.recentTitle, { color: colors.foreground }]}>Living Room Investigation</Text>
                    <Text style={[styles.recentMeta, { color: colors.mutedForeground }]}>2:04 - Apr 15, 2025</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </View>

              <View style={[styles.recentItem, { borderBottomColor: colors.border }]}>
                <View style={styles.recentInfo}>
                  <View style={[styles.recentIcon, { backgroundColor: colors.primary + "20" }]}>
                    <FileText size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.recentTitle, { color: colors.foreground }]}>Investigation Report</Text>
                    <Text style={[styles.recentMeta, { color: colors.mutedForeground }]}>Generated - Apr 14, 2025</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </View>
            </View>
          </CardContent>

          <CardFooter>
            <Button variant="default" fullWidth onPress={() => navigation.navigate("Report" as never)}>
              Generate Report
            </Button>
          </CardFooter>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
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
  recordingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recordingOption: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
  },
  experimentContainer: {
    marginTop: 8,
  },
  experimentCard: {
    borderStyle: "dashed",
  },
  experimentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  experimentIcon: {
    marginRight: 12,
  },
  experimentText: {
    flex: 1,
    fontSize: 14,
  },
  recentList: {
    marginTop: 8,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  recentMeta: {
    fontSize: 12,
  },
})
