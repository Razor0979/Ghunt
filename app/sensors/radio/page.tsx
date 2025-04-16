"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Radio } from "lucide-react"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

export default function RadioFrequencyMonitor() {
  const { toast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [frequency, setFrequency] = useState(100)
  const [signalStrength, setSignalStrength] = useState(0)
  const [anomalyDetected, setAnomalyDetected] = useState(false)
  const [history, setHistory] = useState<{ time: string; frequency: number; strength: number }[]>([])

  // Simulate RF scanning
  useEffect(() => {
    if (!scanning) return

    const interval = setInterval(() => {
      // Generate a random signal strength based on frequency
      // Higher chance of anomalies in certain frequency ranges
      const isAnomalyFrequency = (frequency > 700 && frequency < 900) || (frequency > 1200 && frequency < 1400)

      const anomalyChance = isAnomalyFrequency ? 0.15 : 0.02
      const newStrength =
        Math.random() < anomalyChance
          ? Math.random() * 80 + 20 // Anomaly (20-100)
          : Math.random() * 15 // Normal (0-15)

      setSignalStrength(newStrength)

      // Add to history
      const now = new Date()
      setHistory((prev) => [
        {
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          frequency,
          strength: newStrength,
        },
        ...prev.slice(0, 19), // Keep last 20 readings
      ])

      // Check for anomaly
      if (newStrength > 30 && !anomalyDetected) {
        setAnomalyDetected(true)
        toast({
          title: "RF Anomaly Detected!",
          description: `Unusual signal strength at ${frequency} MHz: ${newStrength.toFixed(1)}%`,
          variant: "destructive",
        })

        // Reset anomaly flag after 3 seconds
        setTimeout(() => {
          setAnomalyDetected(false)
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [scanning, frequency, toast, anomalyDetected])

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Radio Frequency Monitor</h1>
      </div>

      <div className="grid gap-4">
        <Card className={anomalyDetected ? "border-red-500" : ""}>
          <CardHeader className="pb-2">
            <CardTitle>RF Scanner</CardTitle>
            <CardDescription>Monitor radio frequency signals from 50 MHz to 1500 MHz</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center mb-4">
                <div
                  className={`absolute inset-0 rounded-full ${anomalyDetected ? "animate-pulse bg-red-100/50 dark:bg-red-900/30" : ""}`}
                ></div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-mono font-bold">{signalStrength.toFixed(1)}</div>
                  <div className="text-sm mt-1">% Signal</div>
                  <div className="text-sm font-mono mt-2">{frequency} MHz</div>
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frequency</span>
                    <span>{frequency} MHz</span>
                  </div>
                  <Slider
                    value={[frequency]}
                    min={50}
                    max={1500}
                    step={1}
                    onValueChange={(value) => setFrequency(value[0])}
                    disabled={scanning}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50 MHz</span>
                    <span>1500 MHz</span>
                  </div>
                </div>

                <div className="w-full bg-muted h-8 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      signalStrength > 50 ? "bg-red-500" : signalStrength > 20 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(100, signalStrength)}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
                    className="flex-1"
                  >
                    {scanning ? "Stop Scanning" : "Start Scanning"}
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Save Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reading History</CardTitle>
            <CardDescription>Recent RF measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-right text-sm font-medium text-muted-foreground">Frequency</th>
                    <th className="text-right text-sm font-medium text-muted-foreground">Strength</th>
                    <th className="text-right text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        No readings yet. Start scanning to collect data.
                      </td>
                    </tr>
                  ) : (
                    history.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2 text-sm">{item.time}</td>
                        <td className="py-2 text-sm text-right font-mono">{item.frequency} MHz</td>
                        <td className="py-2 text-sm text-right font-mono">{item.strength.toFixed(1)}%</td>
                        <td className="py-2 text-sm text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.strength > 50
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : item.strength > 20
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {item.strength > 50 ? "Strong" : item.strength > 20 ? "Medium" : "Weak"}
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
              <p>Common anomaly ranges: 700-900 MHz, 1200-1400 MHz</p>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>EMF Scanner</CardTitle>
            <CardDescription>Switch to EMF monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sensors/emf">
                <Radio className="h-4 w-4 mr-2" />
                Switch to EMF Scanner
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
