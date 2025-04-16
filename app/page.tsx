"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  BarChart3,
  FileText,
  Mic,
  Radio,
  Settings,
  Users,
  Video,
  Zap,
  Thermometer,
  Volume2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [recording, setRecording] = useState(false)
  const [anomalyDetected, setAnomalyDetected] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Simulate sensor readings
  const [sensorData, setSensorData] = useState({
    emf: 0.2,
    temperature: 21.3,
    pressure: 1013.2,
    humidity: 45.7,
    sound: 32.4,
  })

  // Initialize audio element
  useEffect(() => {
    // Create audio element only on client side
    if (typeof window !== "undefined") {
      const audio = new Audio()
      audio.src = "/anomaly-beep.mp3"
      audio.preload = "auto"

      // Check if audio loaded successfully
      audio.addEventListener("canplaythrough", () => {
        setAudioLoaded(true)
      })

      audio.addEventListener("error", (e) => {
        console.error("Audio failed to load:", e)
      })

      audioRef.current = audio

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  // Play sound function with fallback
  const playAlertSound = () => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.currentTime = 0

      // Use a promise with catch to handle playback errors
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio playback failed:", error)
          // Fallback: visual notification only
          toast({
            title: "Anomaly Alert!",
            description: "Audio notification failed, but anomaly detected.",
            variant: "destructive",
          })
        })
      }
    } else {
      // Fallback if audio isn't loaded
      console.warn("Audio not loaded, using visual alert only")
    }
  }

  // Simulate anomaly detection
  useEffect(() => {
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

        // Play sound effect
        playAlertSound()

        toast({
          title: emfAnomaly ? "EMF Anomaly Detected!" : "Temperature Anomaly Detected!",
          description: emfAnomaly
            ? `Significant EMF fluctuation: ${newEmf.toFixed(2)} μT`
            : `Sudden temperature change: ${Math.abs(newTemp - sensorData.temperature).toFixed(1)}°C`,
          variant: "destructive",
        })

        // Reset anomaly after 5 seconds
        setTimeout(() => {
          setAnomalyDetected(false)
        }, 5000)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [toast, anomalyDetected, sensorData])

  return (
    <main className="container mx-auto p-4 min-h-screen grid-bg">
      {/* Hidden audio element as fallback */}
      <audio id="anomaly-sound" src="/anomaly-beep.mp3" preload="auto" />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Scientific Anomaly Detection System</h1>
          </div>
          <Button variant="outline" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="dashboard" className="glow-effect">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="sensors" className="glow-effect">
              Sensors
            </TabsTrigger>
            <TabsTrigger value="record" className="glow-effect">
              Record
            </TabsTrigger>
            <TabsTrigger value="team" className="glow-effect">
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`${anomalyDetected ? "border-red-500 anomaly-alert" : ""} backdrop-blur-sm bg-card/80`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span>Current Status</span>
                    {anomalyDetected && (
                      <span className="animate-pulse">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Real-time environmental readings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {anomalyDetected && (
                      <div className="bg-red-900/30 p-2 rounded-md flex items-center gap-2 mb-3 animate-pulse">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Anomaly detected!</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Zap className="h-4 w-4 text-primary" /> EMF Reading:
                      </span>
                      <span
                        className={`font-mono ${anomalyDetected && sensorData.emf > 0.35 ? "text-red-400 font-bold" : ""}`}
                      >
                        {sensorData.emf.toFixed(2)} μT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-primary" /> Temperature:
                      </span>
                      <span
                        className={`font-mono ${anomalyDetected && Math.abs(sensorData.temperature - 21.3) > 0.5 ? "text-red-400 font-bold" : ""}`}
                      >
                        {sensorData.temperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Barometric Pressure:</span>
                      <span className="font-mono">{sensorData.pressure.toFixed(1)} hPa</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Humidity:</span>
                      <span className="font-mono">{sensorData.humidity.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Volume2 className="h-4 w-4 text-primary" /> Sound Level:
                      </span>
                      <span className="font-mono">{sensorData.sound.toFixed(1)} dB</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full glow-effect" asChild>
                    <Link href="/baseline">Establish Baseline</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="backdrop-blur-sm bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Start monitoring or recording</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-20 flex flex-col gap-1 glow-effect" asChild>
                    <Link href="/sensors/emf">
                      <Zap className="h-5 w-5 mb-1 text-primary" />
                      <span>EMF Scan</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-1 glow-effect" asChild>
                    <Link href="/sensors/radio">
                      <Radio className="h-5 w-5 mb-1 text-primary" />
                      <span>RF Monitor</span>
                    </Link>
                  </Button>
                  <Button
                    variant={recording ? "destructive" : "outline"}
                    className={`h-20 flex flex-col gap-1 ${!recording && "glow-effect"}`}
                    onClick={() => setRecording(!recording)}
                  >
                    <Mic className={`h-5 w-5 mb-1 ${recording ? "text-destructive-foreground" : "text-primary"}`} />
                    <span>{recording ? "Stop EVP" : "EVP Session"}</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-1 glow-effect" asChild>
                    <Link href="/analysis">
                      <BarChart3 className="h-5 w-5 mb-1 text-primary" />
                      <span>Analysis</span>
                    </Link>
                  </Button>
                </CardContent>
                <CardFooter>
                  <Button variant="default" size="sm" className="w-full" asChild>
                    <Link href="/report">Generate Report</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest recordings and anomalies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-muted">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">EMF Spike Detected</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-muted">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-primary" />
                      <span className="text-sm">EVP Session Recorded</span>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-muted">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="text-sm">Video Recording Saved</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rest of the component remains the same */}
          <TabsContent value="sensors">
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Sensor Monitoring</CardTitle>
                <CardDescription>Real-time data from all available sensors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Electromagnetic Field (EMF)
                    </h3>
                    <div className="h-32 bg-black/50 scanner-bg rounded-md flex items-center justify-center">
                      <div className="text-2xl font-mono relative">
                        <span className={`${sensorData.emf > 0.35 ? "text-red-400" : "text-primary"}`}>
                          {sensorData.emf.toFixed(3)} μT
                        </span>
                        <div
                          className={`absolute -inset-4 rounded-full ${sensorData.emf > 0.35 ? "anomaly-pulse" : ""}`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Baseline: 0.15-0.25 μT</span>
                      <span className={`text-xs ${sensorData.emf > 0.35 ? "text-red-400" : "text-green-400"}`}>
                        {sensorData.emf > 0.35 ? "Anomaly detected" : "Normal range"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" />
                        Temperature
                      </h3>
                      <div className="h-24 bg-black/50 scanner-bg rounded-md flex items-center justify-center">
                        <span className="text-xl font-mono">{sensorData.temperature.toFixed(2)}°C</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">Humidity</h3>
                      <div className="h-24 bg-black/50 scanner-bg rounded-md flex items-center justify-center">
                        <span className="text-xl font-mono">{sensorData.humidity.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">Barometric Pressure</h3>
                      <div className="h-24 bg-black/50 scanner-bg rounded-md flex items-center justify-center">
                        <span className="text-xl font-mono">{sensorData.pressure.toFixed(1)} hPa</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-primary" />
                        Sound Level
                      </h3>
                      <div className="h-24 bg-black/50 scanner-bg rounded-md flex items-center justify-center">
                        <span className="text-xl font-mono">{sensorData.sound.toFixed(1)} dB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="glow-effect" asChild>
                  <Link href="/sensors/emf">EMF Scanner</Link>
                </Button>
                <Button variant="outline" className="glow-effect" asChild>
                  <Link href="/sensors/radio">Radio Frequency</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/baseline">Establish Baseline</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="record">
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Recording Tools</CardTitle>
                <CardDescription>Capture audio, video, and EVP sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-black/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">EVP Session</CardTitle>
                      <CardDescription>Electronic Voice Phenomena recording</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-32 bg-black/30 scanner-bg rounded-md flex items-center justify-center">
                        {recording ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                              <Mic className="h-8 w-8 text-white" />
                            </div>
                            <span className="mt-2 text-sm">Recording...</span>
                          </div>
                        ) : (
                          <Mic className="h-12 w-12 text-primary opacity-70" />
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant={recording ? "destructive" : "default"}
                        className="flex-1"
                        onClick={() => setRecording(!recording)}
                      >
                        {recording ? "Stop Recording" : "Start EVP Session"}
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-black/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Video Recording</CardTitle>
                      <CardDescription>Capture visual evidence</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-32 bg-black/30 scanner-bg rounded-md flex items-center justify-center">
                        <Video className="h-12 w-12 text-primary opacity-70" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="default" className="w-full" asChild>
                        <Link href="/record/video">Start Video Recording</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card className="bg-black/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Controlled Experiment</CardTitle>
                    <CardDescription>Double-blind protocols and randomized timing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up a controlled experiment with double-blind protocols where researchers don't know when
                      recording is happening.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="glow-effect" asChild>
                        <Link href="/experiment/setup">Setup Experiment</Link>
                      </Button>
                      <Button variant="outline" className="glow-effect" asChild>
                        <Link href="/experiment/run">Run Experiment</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage team members and synchronize data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">Lead Investigator</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full">Online</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-black/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          AS
                        </div>
                        <div>
                          <p className="text-sm font-medium">Alice Smith</p>
                          <p className="text-xs text-muted-foreground">Technical Specialist</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">Offline</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="default" className="w-full" asChild>
                    <Link href="/team/add">Add Team Member</Link>
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium">Data Synchronization</h3>
                  <p className="text-sm text-muted-foreground">
                    Synchronize timestamps and data across all team devices for correlation analysis.
                  </p>
                  <Button variant="outline" className="w-full glow-effect">
                    Sync Team Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
          <div className="flex gap-2 backdrop-blur-sm bg-black/70 p-2 rounded-full">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard">
                <BarChart3 className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/report">
                <FileText className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/team">
                <Users className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
