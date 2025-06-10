"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Droplet,
  MapPin,
  Search,
  Filter,
  Download,
  Award,
  Heart,
  TrendingUp,
  CheckCircle,
  FileText,
} from "lucide-react"

export default function MemberHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const donationHistory = [
    {
      id: "don-001",
      date: "2025-04-15",
      type: "Whole Blood",
      amount: "450ml",
      location: "Central Blood Bank",
      address: "123 Main Street, Downtown",
      requestId: "req-001",
      requestedBy: "General Hospital",
      urgency: "Critical",
      patientsHelped: 3,
      hemoglobin: "14.2 g/dL",
      bloodPressure: "120/80",
      pulse: "72 bpm",
      temperature: "98.6°F",
      status: "completed",
      staffNotes: "Excellent donation, no complications",
      certificateUrl: "/certificates/don-001.pdf",
    },
    {
      id: "don-002",
      date: "2025-01-10",
      type: "Plasma",
      amount: "600ml",
      location: "Mobile Blood Drive",
      address: "University Campus, Building A",
      requestId: "req-002",
      requestedBy: "Children's Hospital",
      urgency: "High",
      patientsHelped: 2,
      hemoglobin: "13.8 g/dL",
      bloodPressure: "118/78",
      pulse: "68 bpm",
      temperature: "98.4°F",
      status: "completed",
      staffNotes: "Good donation, donor felt well throughout",
      certificateUrl: "/certificates/don-002.pdf",
    },
    {
      id: "don-003",
      date: "2024-10-05",
      type: "Platelets",
      amount: "200ml",
      location: "University Hospital",
      address: "789 University Drive",
      requestId: "req-003",
      requestedBy: "Cancer Treatment Center",
      urgency: "Medium",
      patientsHelped: 1,
      hemoglobin: "14.0 g/dL",
      bloodPressure: "122/82",
      pulse: "75 bpm",
      temperature: "98.8°F",
      status: "completed",
      staffNotes: "Platelet donation successful, good recovery",
      certificateUrl: "/certificates/don-003.pdf",
    },
    {
      id: "don-004",
      date: "2024-07-20",
      type: "Double Red Cells",
      amount: "450ml",
      location: "Central Blood Bank",
      address: "123 Main Street, Downtown",
      requestId: "req-004",
      requestedBy: "Emergency Medical Center",
      urgency: "Critical",
      patientsHelped: 4,
      hemoglobin: "14.5 g/dL",
      bloodPressure: "115/75",
      pulse: "70 bpm",
      temperature: "98.5°F",
      status: "completed",
      staffNotes: "Double red cell donation, excellent vitals",
      certificateUrl: "/certificates/don-004.pdf",
    },
    {
      id: "don-005",
      date: "2024-04-12",
      type: "Whole Blood",
      amount: "450ml",
      location: "Community Health Center",
      address: "456 Oak Avenue, Midtown",
      requestId: "req-005",
      requestedBy: "Metro Hospital",
      urgency: "High",
      patientsHelped: 3,
      hemoglobin: "13.9 g/dL",
      bloodPressure: "125/80",
      pulse: "74 bpm",
      temperature: "98.7°F",
      status: "completed",
      staffNotes: "Standard donation, no issues reported",
      certificateUrl: "/certificates/don-005.pdf",
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const filteredHistory = donationHistory.filter((donation) => {
    const matchesSearch =
      donation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const donationYear = new Date(donation.date).getFullYear().toString()
    const matchesYear = yearFilter === "all" || donationYear === yearFilter

    const matchesType = typeFilter === "all" || donation.type === typeFilter

    return matchesSearch && matchesYear && matchesType
  })

  const totalDonations = donationHistory.length
  const totalVolume = donationHistory.reduce((sum, donation) => {
    return sum + Number.parseInt(donation.amount.replace("ml", ""))
  }, 0)
  const totalPatientsHelped = donationHistory.reduce((sum, donation) => sum + donation.patientsHelped, 0)
  const currentYear = new Date().getFullYear()
  const thisYearDonations = donationHistory.filter(
    (donation) => new Date(donation.date).getFullYear() === currentYear,
  ).length

  return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
              <p className="text-gray-600">Your complete record of life-saving donations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export History
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Award className="mr-2 h-4 w-4" />
                View Certificates
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Total Donations</p>
                    <p className="text-2xl font-bold text-red-700">{totalDonations}</p>
                  </div>
                  <Droplet className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Blood Donated</p>
                    <p className="text-2xl font-bold text-blue-700">{(totalVolume / 1000).toFixed(1)}L</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Lives Saved</p>
                    <p className="text-2xl font-bold text-green-700">{totalPatientsHelped}</p>
                  </div>
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">This Year</p>
                    <p className="text-2xl font-bold text-purple-700">{thisYearDonations}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by location, type, or hospital..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Whole Blood">Whole Blood</SelectItem>
                      <SelectItem value="Plasma">Plasma</SelectItem>
                      <SelectItem value="Platelets">Platelets</SelectItem>
                      <SelectItem value="Double Red Cells">Double Red Cells</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation History */}
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <div className="space-y-4">
                {filteredHistory.map((donation, index) => (
                  <Card key={donation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-red-100 rounded-full">
                            <Droplet className="h-5 w-5 text-red-600" />
                          </div>
                          {index < filteredHistory.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{donation.type}</h3>
                                <Badge variant="outline">{donation.amount}</Badge>
                                <Badge className={getUrgencyColor(donation.urgency)}>{donation.urgency}</Badge>
                              </div>
                              <p className="text-gray-600 mb-2">
                                Requested by <span className="font-medium">{donation.requestedBy}</span>
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(donation.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{donation.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{donation.patientsHelped} patients helped</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Hemoglobin: {donation.hemoglobin}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Completed
                              </Badge>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-1 h-3 w-3" />
                                  View Report
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="mr-1 h-3 w-3" />
                                  Certificate
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed">
              <div className="space-y-4">
                {filteredHistory.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-red-500" />
                        {donation.type} - {new Date(donation.date).toLocaleDateString()}
                      </CardTitle>
                      <CardDescription>
                        Donation ID: {donation.id} • Request ID: {donation.requestId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Donation Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type:</span>
                              <span className="font-medium">{donation.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-medium">{donation.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Location:</span>
                              <span className="font-medium">{donation.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Requested by:</span>
                              <span className="font-medium">{donation.requestedBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Urgency:</span>
                              <Badge className={getUrgencyColor(donation.urgency)}>
                                {donation.urgency}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Patients Helped:</span>
                              <span className="font-medium">{donation.patientsHelped}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Health Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Hemoglobin:</span>
                              <span className="font-medium">{donation.hemoglobin}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Blood Pressure:</span>
                              <span className="font-medium">{donation.bloodPressure}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Pulse:</span>
                              <span className="font-medium">{donation.pulse}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Temperature:</span>
                              <span className="font-medium">{donation.temperature}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <Badge className="bg-green-500">Completed</Badge>
                            </div>
                          </div>
                          {donation.staffNotes && (
                            <div className="mt-4">
                              <h5 className="font-medium text-sm mb-1">Staff Notes:</h5>
                              <p className="text-sm text-gray-600 italic">"{donation.staffNotes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Whole Blood", "Plasma", "Platelets", "Double Red Cells"].map((type) => {
                        const count = donationHistory.filter((d) => d.type === type).length
                        const percentage = (count / totalDonations) * 100
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{type}</span>
                              <span>{count} donations</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Yearly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["2025", "2024", "2023"].map((year) => {
                        const count = donationHistory.filter(
                          (d) => new Date(d.date).getFullYear().toString() === year,
                        ).length
                        const volume = donationHistory
                          .filter((d) => new Date(d.date).getFullYear().toString() === year)
                          .reduce((sum, d) => sum + Number.parseInt(d.amount.replace("ml", "")), 0)
                        return (
                          <div key={year} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{year}</span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{count} donations</div>
                                <div className="text-xs text-gray-500">{volume}ml total</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
  )
}
