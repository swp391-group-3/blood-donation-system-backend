"use client"
import { useState } from "react"
import { Search, Calendar, Clock, Plus, Filter, Eye, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const summaryStats = {
  totalDonations: 2,
  bloodDonated: "600ml",
  totalVolume: "Total volume donated",
  nextEligible: "Jun 15",
  nextDonationDate: "Next donation date",
}

const upcomingAppointments = [
  {
    id: 1,
    title: "Emergency O- needed for surgery",
    status: "Confirmed",
    priority: "High Priority",
    bloodGroup: "O-",
    date: "6/3/2025",
    time: "10:00 AM",
    duration: "45-60 minutes",
    notes: "Eat well and stay hydrated before your appointment",
    timeUntil: "Past",
  },
  {
    id: 2,
    title: "Regular donation drive",
    status: "Pending",
    priority: "Medium Priority",
    bloodGroup: "All",
    date: "6/15/2025",
    time: "2:30 PM",
    duration: "45-60 minutes",
    notes: "Bring a valid ID and eat a healthy meal",
    timeUntil: "In 8 days",
  },
]

const completedAppointments = [
  {
    id: 3,
    title: "Regular blood donation",
    status: "Completed",
    priority: "Standard",
    bloodGroup: "O-",
    date: "5/15/2025",
    time: "11:00 AM",
    location: "Main Blood Center, 123 Medical Drive",
    duration: "45 minutes",
    notes: "Successful donation - 450ml collected",
  },
  {
    id: 4,
    title: "Emergency donation request",
    status: "Completed",
    priority: "High Priority",
    bloodGroup: "O-",
    date: "4/20/2025",
    time: "3:15 PM",
    location: "Emergency Response Unit",
    duration: "50 minutes",
    notes: "Critical need fulfilled - patient stable",
  },
]

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high priority":
        return "destructive"
      case "medium priority":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: any; showActions?: boolean }) => (
    <Card className="mb-4 border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{appointment.title}</h3>
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
          {appointment.priority && (
            <Badge variant={getPriorityColor(appointment.priority)} className="text-xs">
              {appointment.priority}
            </Badge>
          )}
          {appointment.timeUntil && <span className="text-sm text-blue-600 font-medium">{appointment.timeUntil}</span>}
          {showActions && (
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm">💧</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Group</p>
              <p className="text-sm font-semibold">{appointment.bloodGroup}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p className="text-sm font-semibold">{appointment.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Time</p>
              <p className="text-sm font-semibold">{appointment.time}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 p-4 bg-zinc-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Estimated Duration</p>
            <p className="text-sm text-gray-800">{appointment.duration}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Preparation Notes</p>
            <p className="text-sm text-gray-800">{appointment.notes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Main Appointments Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your blood donation appointments and track your donation history
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Donation
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-lg">💧</span>
              </div>
              <CardTitle className="text-lg">Total Donations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">{summaryStats.totalDonations}</div>
            <p className="text-sm text-muted-foreground mb-3">{summaryStats.lifetimeDonations}</p>
            <Progress value={40} className="h-2 mb-2" />
            <p className="text-sm text-red-600">{summaryStats.nextMilestone}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-lg">🩸</span>
              </div>
              <CardTitle className="text-lg">Blood Donated</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{summaryStats.bloodDonated}</div>
            <p className="text-sm text-muted-foreground mb-1">{summaryStats.totalVolume}</p>
            <p className="text-sm text-blue-600">{summaryStats.livesEquivalent}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg">Next Eligible</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{summaryStats.nextEligible}</div>
            <p className="text-sm text-muted-foreground mb-1">{summaryStats.nextDonationDate}</p>
            <p className="text-sm text-green-600">{summaryStats.weeksRemaining}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
