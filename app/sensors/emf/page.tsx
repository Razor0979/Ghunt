"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Radio, Zap } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function EMFScanner() {
  const { toast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [emfValue, setEmfValue] = useState(0.18)
  const [anomalyDetected, setAnomalyDetected] = useState(false)
  const [history, setHistory] = useState<{ time: string; value: number }[]>([])
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
        })
      }
    } else {
      // Fallback if audio isn't loaded
      console.warn("Audio not loaded, using visual alert only")
    }
  }

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
      setHistory((prev) => [
        { time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`, value: newValue },
        ...prev.slice(0, 19), // Keep last 20 readings
      ])

      // Check for anomaly
      if (newValue > 0.5 && !anomalyDetected) {
        setAnomalyDetected(true)

        // Play sound effect
        playAlertSound()

        toast({
          title: "EMF Anomaly Detected!",
          description: `Unusual reading: ${newValue.toFixed(3)} μT`,
          variant: "destructive",
        })

        // Reset anomaly flag after 3 seconds
        setTimeout(() => {
          setAnomalyDetected(false)
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [scanning, toast, anomalyDetected, audioLoaded])

  return (
    <main className="container mx-auto p-4 min-h-screen grid-bg">
      {/* Hidden audio element as fallback */}
      <audio id="anomaly-sound" src="/anomaly-beep.mp3" preload="auto" />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">EMF Scanner</h1>
          </div>
        </div>

        <div className="grid gap-4">
          <Card className={`${anomalyDetected ? "border-red-500 anomaly-alert" : ""} backdrop-blur-sm bg-card/80`}>
            <CardHeader className="pb-2">
              <CardTitle>Electromagnetic Field Scanner</CardTitle>
              <CardDescription>Measures magnetic field fluctuations in μT (microTesla)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center mb-4 radar-sweep">
                  <div
                    className={`absolute inset-0 rounded-full ${anomalyDetected ? "animate-pulse bg-red-900/30" : ""}`}
                  ></div>
                  <div className="text-4xl font-mono font-bold z-10">{emfValue.toFixed(3)}</div>
                  <div className="text-sm mt-2 z-10">μT</div>
                </div>

                <div className="w-full bg-black/50 h-8 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full ${
                      emfValue > 0.5 ? "bg-red-500" : emfValue > 0.3 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(100, emfValue * 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between w-full text-xs mt-1">
                  <span>0.0</span>
                  <span>0.5</span>
                  <span>1.0</span>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
                    className={scanning ? "" : "glow-effect"}
                  >
                    {scanning ? "Stop Scanning" : "Start Scanning"}
                  </Button>
                  <Button variant="outline" className="glow-effect">
                    <Download className="h-4 w-4 mr-2" />
                    Save Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle>Reading History</CardTitle>
              <CardDescription>Recent EMF measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto scanner-bg rounded-md p-2">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-muted-foreground">Time</th>
                      <th className="text-right text-sm font-medium text-muted-foreground">Reading (μT)</th>
                      <th className="text-right text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-muted-foreground">
                          No readings yet. Start scanning to collect data.
                        </td>
                      </tr>
                    ) : (
                      history.map((item, index) => (
                        <tr key={index} className="border-b border-muted/20 last:border-0">
                          <td className="py-2 text-sm">{item.time}</td>
                          <td className="py-2 text-sm text-right font-mono">{item.value.toFixed(3)}</td>
                          <td className="py-2 text-sm text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.value > 0.5
                                  ? "bg-red-900/30 text-red-300"
                                  : item.value > 0.3
                                    ? "bg-yellow-900/30 text-yellow-300"
                                    : "bg-green-900/30 text-green-300"
                              }`}
                            >
                              {item.value > 0.5 ? "Anomaly" : item.value > 0.3 ? "Elevated" : "Normal"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                <p>Normal range: 0.1-0.3 μT | Elevated: 0.3-0.5 μT | Anomaly: &gt;0.5 μT</p>
              </div>
            </CardFooter>
          </Card>

          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle>Radio Frequency Monitor</CardTitle>
              <CardDescription>Switch to RF monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full glow-effect" asChild>
                <Link href="/sensors/radio">
                  <Radio className="h-4 w-4 mr-2" />
                  Switch to RF Monitor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
