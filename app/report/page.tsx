"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, FileText, Mail, Share2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function ReportPage() {
  const { toast } = useToast()
  const [generating, setGenerating] = useState(false)

  const handleGenerateReport = () => {
    setGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setGenerating(false)
      toast({
        title: "Report Generated",
        description: "Your investigation report has been generated successfully.",
      })
    }, 2000)
  }

  const handleEmailReport = () => {
    toast({
      title: "Report Emailed",
      description: "Your report has been sent to your registered email address.",
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
        <h1 className="text-2xl font-bold">Investigation Report</h1>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Create a comprehensive report of your investigation data and findings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Investigation Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Location:</div>
                      <div>123 Main Street, Basement</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Date:</div>
                      <div>April 15, 2025</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Duration:</div>
                      <div>2 hours 15 minutes</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Team Members:</div>
                      <div>John Doe, Alice Smith</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Findings Overview</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded text-xs">
                        Anomaly
                      </span>
                      <div>
                        <p className="font-medium">EMF Spike at 9:42 PM</p>
                        <p className="text-muted-foreground">0.78 μT reading, 289% above baseline</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded text-xs">
                        Anomaly
                      </span>
                      <div>
                        <p className="font-medium">Temperature Drop at 10:15 PM</p>
                        <p className="text-muted-foreground">3.2°C drop over 45 seconds</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded text-xs">
                        Audio
                      </span>
                      <div>
                        <p className="font-medium">Unexplained Sound at 10:22 PM</p>
                        <p className="text-muted-foreground">Low frequency (18Hz) sound detected</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="data">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Sensor Data</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Complete raw data from all sensors during the investigation
                    </p>
                    <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Data visualization chart would appear here</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Recordings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p>EVP Session #1</p>
                          <p className="text-xs text-muted-foreground">2:04 - 9:42 PM</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Raw
                        </Button>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p>Video Recording #1</p>
                          <p className="text-xs text-muted-foreground">10:15 - 10:45 PM</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Raw
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Statistical Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Comparison of investigation data against established baseline
                    </p>
                    <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Statistical analysis chart would appear here</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Correlation Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Correlation between sensor readings and subjective experiences
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded text-xs">
                          High
                        </span>
                        <div>
                          <p className="font-medium">EMF Spike + Temperature Drop</p>
                          <p className="text-muted-foreground">92% correlation at 10:15 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded text-xs">
                          Medium
                        </span>
                        <div>
                          <p className="font-medium">Audio Anomaly + Subjective Experience</p>
                          <p className="text-muted-foreground">68% correlation at 10:22 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEmailReport}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button onClick={handleGenerateReport} disabled={generating}>
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Full Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Previous Reports</CardTitle>
            <CardDescription>Access your saved investigation reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">123 Main Street Investigation</h3>
                  <p className="text-xs text-muted-foreground">April 10, 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">Old Town Library</h3>
                  <p className="text-xs text-muted-foreground">March 28, 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
