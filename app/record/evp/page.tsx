"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Mic, Pause, Play, Save, StopCircle } from "lucide-react"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

export default function EVPSession() {
  const { toast } = useToast()
  const [recording, setRecording] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [recordings, setRecordings] = useState<{ id: number; name: string; duration: number }[]>([
    { id: 1, name: "EVP Session #1", duration: 124 },
    { id: 2, name: "Basement Recording", duration: 312 },
  ])

  // Simulate recording
  useEffect(() => {
    if (!recording) return

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)

      // Simulate random anomaly detection during recording (2% chance)
      if (Math.random() < 0.02) {
        toast({
          title: "Potential Audio Anomaly",
          description: "Unusual frequency pattern detected in audio stream.",
          variant: "default",
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [recording, toast])

  // Simulate playback
  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 124) {
          setPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [playing])

  const handleSaveRecording = () => {
    setRecording(false)
    setRecordings((prev) => [
      ...prev,
      {
        id: prev.length + 3,
        name: `EVP Session #${prev.length + 3}`,
        duration,
      },
    ])
    setDuration(0)
    toast({
      title: "Recording Saved",
      description: `EVP Session #${recordings.length + 3} has been saved successfully.`,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">EVP Session</h1>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Electronic Voice Phenomena Recording</CardTitle>
            <CardDescription>Record audio while asking questions to capture potential responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              {recording ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-red-500 animate-pulse flex items-center justify-center mb-4">
                    <Mic className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-2xl font-mono font-bold">{formatTime(duration)}</div>
                  <p className="text-sm text-muted-foreground mt-2">Recording in progress...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Mic className="h-12 w-12" />
                  </div>
                  <p className="text-sm text-muted-foreground">Ready to record</p>
                </div>
              )}

              <div className="flex gap-2 mt-8">
                {recording ? (
                  <>
                    <Button variant="destructive" onClick={() => setRecording(false)}>
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                    <Button variant="outline" onClick={handleSaveRecording}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button variant="default" onClick={() => setRecording(true)}>
                    <Mic className="h-4 w-4 mr-2" />
                    Start EVP Session
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Playback & Analysis</CardTitle>
            <CardDescription>Review and analyze your recordings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">EVP Session #1</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {playing ? (
                      <Button size="icon" variant="outline" onClick={() => setPlaying(false)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="outline" onClick={() => setPlaying(true)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex-1">
                      <Slider
                        value={[currentTime]}
                        max={124}
                        step={1}
                        onValueChange={(value) => setCurrentTime(value[0])}
                      />
                    </div>
                    <span className="text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(124)}
                    </span>
                  </div>

                  <div className="h-24 bg-muted rounded-md">
                    {/* Audio waveform visualization would go here */}
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Waveform visualization</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Saved Recordings</h3>
                <div className="space-y-2">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <p className="text-sm font-medium">{recording.name}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(recording.duration)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
