"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock, MapPin, Droplet, Zap, Phone, Navigation, Heart, Users, Timer } from "lucide-react"
import {
    emergencyRequests
} from '../../../../constants/sample-data';


export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sortBy, setSortBy] = useState("priority")
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all")
  const [isResponding, setIsResponding] = useState<number | null>(null)

  useEffect(() => {
    // Get user's location for distance calculations
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied")
        },
      )
    }
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 animate-pulse"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Zap className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleEmergencyResponse = async (requestId: number) => {
    setIsResponding(requestId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would navigate to the emergency response flow
    window.location.href = `/dashboard/emergency/${requestId}/respond`
  }

  return (
      <div className="space-y-6 p-6">
        {/* Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Emergency Blood Requests</h1>
              <p className="text-red-100">Critical situations requiring immediate donor response</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{emergencyRequests.length}</div>
              <div className="text-red-100">Active Emergencies</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {emergencyRequests.filter((r) => r.priority === "critical").length}
              </div>
              <div className="text-red-100">Critical Cases</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {emergencyRequests.reduce((sum, r) => sum + (r.unitsNeeded - r.unitsSecured), 0)}
              </div>
              <div className="text-red-100">Units Still Needed</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority Level</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="time">Time Posted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Requests */}
        <div className="space-y-4">
          {emergencyRequests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-red-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                        {getPriorityIcon(request.priority)}
                        {request.priority.toUpperCase()}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-sm">{request.hospital}</div>
                          <div className="text-xs text-gray-500">{request.distance} away</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="font-medium text-sm">{request.bloodGroup} Blood</div>
                          <div className="text-xs text-gray-500">
                            {request.unitsSecured}/{request.unitsNeeded} units secured
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium text-sm">Posted {request.timePosted}</div>
                          <div className="text-xs text-gray-500">~{request.estimatedTime} remaining</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">{request.contactPerson}</div>
                          <div className="text-xs text-gray-500">{request.contactPhone}</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{request.description}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(request.unitsSecured / request.unitsNeeded) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round((request.unitsSecured / request.unitsNeeded) * 100)}% secured
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button
                      className="bg-red-600 hover:bg-red-700 w-full"
                      onClick={() => handleEmergencyResponse(request.id)}
                      disabled={isResponding === request.id}
                    >
                      {isResponding === request.id ? (
                        <>
                          <Timer className="mr-2 h-4 w-4 animate-spin" />
                          Responding...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Respond Now
                        </>
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{request.unitsNeeded - request.unitsSecured}</div>
                      <div className="text-xs text-gray-500">units still needed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <AlertTriangle className="h-5 w-5" />
              Emergency Response Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-medium mb-2">Before Responding:</h4>
                <ul className="space-y-1">
                  <li>• Ensure you're eligible to donate (8+ weeks since last donation)</li>
                  <li>• Eat a healthy meal and stay hydrated</li>
                  <li>• Bring valid ID and emergency contact info</li>
                  <li>• Inform the hospital you're responding to an emergency</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Emergency Protocol:</h4>
                <ul className="space-y-1">
                  <li>• Call the hospital before arriving</li>
                  <li>• Mention the emergency request ID</li>
                  <li>• Follow expedited screening process</li>
                  <li>• Emergency donations are processed immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
