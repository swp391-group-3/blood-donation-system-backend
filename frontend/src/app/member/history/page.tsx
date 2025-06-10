'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { donationHistory } from '../../../../constants/sample-data';


export default function MemberHistoryPage() {

    const [searchTerm, setSearchTerm] = useState("")
    const [year, setYear] = useState("")
    const [type, setType] = useState("")

    function handleSearch() {
        // come in future
    }
    
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Critical':
                return 'bg-red-500';
            case 'High':
                return 'bg-orange-500';
            case 'Medium':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Donation History
                    </h1>
                    <p className="text-zinc-600">
                        Your complete record of life-saving donations
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-red-600 hover:bg-red-700">
                        <Award className="mr-2 h-4 w-4" />
                        View Certificates
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle> Impact</CardTitle>
                        <CardDescription>
                            How your donations have helped community
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 mb-1">
                                    5
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Total Donations
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    2.25L
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Blood Donated
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex w-full items-center gap-2">   
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                    <Input 
                        type="search"
                        placeholder="Search by name"
                        className="pl-9 w-full h-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearch()
                        }}
                    />
                </div>
                <Select 
                    onValueChange={(value) => {
                        setYear(value)
                        handleSearch()
                    }}
                >
                    <SelectTrigger className="w-[180px] h-10">
                        <Calendar className="mr-2 h-4 w-4"/>
                        <SelectValue placeholder="Year"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                </Select>

                <Select 
                    onValueChange={(value) => {
                        setType(value)
                        handleSearch()
                    }}
                >
                    <SelectTrigger className="w-[180px] h-10">
                        <Droplet className="mr-2 h-4 w-4"/>
                        <SelectValue placeholder="Blood Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            

            {/* Donation History */}
            <Tabs defaultValue="timeline" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed View</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                    <div className="space-y-4">
                        {donationHistory.map((donation, index) => (
                            <Card
                                key={donation.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="p-2 bg-red-100 rounded-full">
                                                <Droplet className="h-5 w-5 text-red-600" />
                                            </div>
                                            {index <
                                                donationHistory.length - 1 && (
                                                <div className="w-px h-16 bg-gray-200 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-lg">
                                                            {donation.type}
                                                        </h3>
                                                        <Badge variant="outline">
                                                            {donation.amount}
                                                        </Badge>
                                                        <Badge
                                                            className={getUrgencyColor(
                                                                donation.urgency,
                                                            )}
                                                        >
                                                            {donation.urgency}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">
                                                        Requested by{' '}
                                                        <span className="font-medium">
                                                            {
                                                                donation.requestedBy
                                                            }
                                                        </span>
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {new Date(
                                                                    donation.date,
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>
                                                                {
                                                                    donation.location
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="h-4 w-4" />
                                                            <span>
                                                                {
                                                                    donation.patientsHelped
                                                                }{' '}
                                                                patients helped
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>
                                                                Hemoglobin:{' '}
                                                                {
                                                                    donation.hemoglobin
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-100 text-green-800 border-green-200"
                                                    >
                                                        Completed
                                                    </Badge>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            View Report
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
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
                        {donationHistory.map((donation) => (
                            <Card key={donation.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Droplet className="h-5 w-5 text-red-500" />
                                        {donation.type} -{' '}
                                        {new Date(
                                            donation.date,
                                        ).toLocaleDateString()}
                                    </CardTitle>
                                    <CardDescription>
                                        Donation ID: {donation.id} • Request ID:{' '}
                                        {donation.requestId}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium mb-3">
                                                Donation Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Type:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.type}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Amount:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.amount}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Location:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.location}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Requested by:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.requestedBy}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Urgency:
                                                    </span>
                                                    <Badge
                                                        className={getUrgencyColor(
                                                            donation.urgency,
                                                        )}
                                                    >
                                                        {donation.urgency}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Patients Helped:
                                                    </span>
                                                    <span className="font-medium">
                                                        {
                                                            donation.patientsHelped
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-3">
                                                Health Metrics
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Hemoglobin:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.hemoglobin}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Blood Pressure:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.bloodPressure}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Pulse:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.pulse}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Temperature:
                                                    </span>
                                                    <span className="font-medium">
                                                        {donation.temperature}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        Status:
                                                    </span>
                                                    <Badge className="bg-green-500">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </div>
                                            {donation.staffNotes && (
                                                <div className="mt-4">
                                                    <h5 className="font-medium text-sm mb-1">
                                                        Staff Notes:
                                                    </h5>
                                                    <p className="text-sm text-gray-600 italic">
                                                        "{donation.staffNotes}"
                                                    </p>
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
                                    {[
                                        'Whole Blood',
                                        'Plasma',
                                        'Platelets',
                                        'Double Red Cells',
                                    ].map((type) => {
                                        const count = donationHistory.filter(
                                            (d) => d.type === type,
                                        ).length;
                                        const percentage =
                                            (count / 10) * 100;
                                        return (
                                            <div key={type}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{type}</span>
                                                    <span>
                                                        {count} donations
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-red-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
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
                                    {['2025', '2024', '2023'].map((year) => {
                                        const count = donationHistory.filter(
                                            (d) =>
                                                new Date(d.date)
                                                    .getFullYear()
                                                    .toString() === year,
                                        ).length;
                                        const volume = donationHistory
                                            .filter(
                                                (d) =>
                                                    new Date(d.date)
                                                        .getFullYear()
                                                        .toString() === year,
                                            )
                                            .reduce(
                                                (sum, d) =>
                                                    sum +
                                                    Number.parseInt(
                                                        d.amount.replace(
                                                            'ml',
                                                            '',
                                                        ),
                                                    ),
                                                0,
                                            );
                                        return (
                                            <div
                                                key={year}
                                                className="p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">
                                                        {year}
                                                    </span>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">
                                                            {count} donations
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {volume}ml total
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
