"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Play, Save } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function BaselineEstablishment() {
  const { toast } = useToast()
  const [collecting, setCollecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState("15")

  // Simulate baseline collection
  const startCollection = () => {
    setCollecting(true)
    setProgress(0)

    const interval = setInterval(
      () => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setCollecting(false)
            toast({
              title: "Baseline Established",
              description: "Environmental baseline has been successfully recorded and saved.",
            })
            return 100
          }
          return prev + 1
        })
      },
      (Number.parseInt(duration) * 600) / 100,
    ) // Progress based on selected duration

    toast({
      title: "Baseline Collection Started",
      description: `Recording environmental conditions for ${duration} minutes.`,
    })
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Establish Baseline</h1>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Baseline</CardTitle>
            <CardDescription>
              Record normal environmental conditions to establish a baseline for anomaly detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                A baseline is essential for scientific investigation. It records the normal environmental conditions of
                a location over an extended period, allowing the system to identify genuine anomalies that deviate
                significantly from normal readings.
              </p>

              <div className="p-3 bg-muted rounded-md">
                <h3 className="text-sm font-medium mb-1">Sensors included in baseline:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Electromagnetic Field (EMF)</li>
                  <li>• Temperature</li>
                  <li>• Barometric Pressure</li>
                  <li>• Humidity</li>
                  <li>• Ambient Sound Levels</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-4 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="location">Location Name</Label>
                <Input id="location" placeholder="e.g., Living Room, Basement" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Collection Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Longer durations provide more accurate baselines but require more time.
                </p>
              </div>
            </div>

            {collecting && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Collection in progress...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Remaining: {Math.ceil((Number.parseInt(duration) * 60 * (100 - progress)) / 100)} seconds
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>

            {collecting ? (
              <Button variant="destructive" onClick={() => setCollecting(false)}>
                Stop Collection
              </Button>
            ) : (
              <Button onClick={startCollection}>
                {progress === 100 ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Baseline
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Collection
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Saved Baselines</CardTitle>
            <CardDescription>Previously established environmental baselines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Living Room</h3>
                    <p className="text-xs text-muted-foreground">Recorded 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Load
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">EMF:</span> 0.15-0.22 μT
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temp:</span> 21.2-22.1°C
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sound:</span> 28-35 dB
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Basement</h3>
                    <p className="text-xs text-muted-foreground">Recorded 5 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Load
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">EMF:</span> 0.18-0.25 μT
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temp:</span> 18.5-19.2°C
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sound:</span> 22-28 dB
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
