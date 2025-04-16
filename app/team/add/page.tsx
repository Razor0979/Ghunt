"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function AddTeamMember() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")

  const handleAddMember = () => {
    if (!name || !email || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Team Member Added",
      description: `${name} has been added to your investigation team.`,
    })

    // Reset form
    setName("")
    setEmail("")
    setRole("")
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/team">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add Team Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Team Member</CardTitle>
          <CardDescription>Add a new member to your investigation team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">An invitation will be sent to this email address.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Team Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead Investigator</SelectItem>
                <SelectItem value="tech">Technical Specialist</SelectItem>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="observer">Observer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="permissions">Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm-view" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="perm-view" className="text-sm">
                  View investigation data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm-record" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="perm-record" className="text-sm">
                  Record audio/video
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm-edit" className="rounded border-gray-300" />
                <label htmlFor="perm-edit" className="text-sm">
                  Edit reports and analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm-admin" className="rounded border-gray-300" />
                <label htmlFor="perm-admin" className="text-sm">
                  Administrator access
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/team">Cancel</Link>
          </Button>
          <Button onClick={handleAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Team Synchronization</CardTitle>
          <CardDescription>Manage data sharing between team devices</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            When team members are added, their devices can be synchronized to share data in real-time during
            investigations. This allows for correlation of readings across multiple locations and devices.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Lead Investigator</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                Synced
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  AS
                </div>
                <div>
                  <p className="text-sm font-medium">Alice Smith</p>
                  <p className="text-xs text-muted-foreground">Technical Specialist</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
