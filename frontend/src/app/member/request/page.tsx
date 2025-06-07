'use client';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Droplet,
    Plus,
    Search,
    Filter,
    Calendar,
    MapPin,
    Users,
    Clock,
    AlertTriangle,
    Heart,
} from 'lucide-react';
import Link from 'next/link';
import { mockRequests } from '../../../../constants/sample-data';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';


const schema = z.object({
    searchTerm: z.string().optional().default(""),
    priority: z.string().default("all"),
    bloodGroup: z.string().default("all"),
});

export type SearchFormValues = z.infer<typeof schema>;

export default function BloodRequestPage() {
    const [statusFilter, setStatusFilter] = useState('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
    const [filteredRequests, setFilteredRequests] = useState(mockRequests);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            searchTerm: "",
            priority: "all",
            bloodGroup: "all",
        },
    });

    function handleSearch(data : SearchFormValues) {
        // Come in future
    }

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    color: 'bg-red-500',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-50',
                    icon: AlertTriangle,
                    label: 'High Priority',
                };
            case 'medium':
                return {
                    color: 'bg-yellow-500',
                    textColor: 'text-yellow-700',
                    bgColor: 'bg-yellow-50',
                    icon: Clock,
                    label: 'Medium Priority',
                };
            case 'low':
                return {
                    color: 'bg-green-500',
                    textColor: 'text-green-700',
                    bgColor: 'bg-green-50',
                    icon: Heart,
                    label: 'Low Priority',
                };
            default:
                return {
                    color: 'bg-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-50',
                    icon: Heart,
                    label: 'Normal',
                };
        }
    };

    type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

    const compatible: Record<BloodType, BloodType[]> = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+'],
    };

    // Suppose this is defined somewhere in your component/service
    const userBloodGroup: BloodType = 'O-'; // Example; set this as needed

    function isCompatibleBloodGroup(requestBloodGroup: string): boolean {
        if (requestBloodGroup === 'All') return true;

        // Type guard to check if input is a valid blood type
        const isBloodType = (group: string): group is BloodType =>
            Object.keys(compatible).includes(group);

        if (!isBloodType(userBloodGroup) || !isBloodType(requestBloodGroup)) {
            return false; // Invalid blood type
        }

        return compatible[userBloodGroup].includes(
            requestBloodGroup as BloodType,
        );
    }

    const getRecommendedRequests = () => {
        return mockRequests.filter(
            (request) =>
                isCompatibleBloodGroup(request.bloodGroup) ||
                request.priority === 'high',
        );
    };

    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Blood Donation Requests
                    </h1>
                    <p className="text-gray-500">
                        Find and respond to blood donation opportunities
                    </p>
                </div>
            </div>

            <Tabs
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active Requests</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
                </TabsList>

                

                <TabsContent value="active" className="space-y-6">
                    {filteredRequests.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredRequests.map((request) => {
                                const priorityConfig = getPriorityConfig(
                                    request.priority,
                                );
                                const PriorityIcon = priorityConfig.icon;
                                const isCompatible = isCompatibleBloodGroup(
                                    request.bloodGroup,
                                );
                                const progressPercentage =
                                    (request.currentPeople /
                                        request.maxPeople) *
                                    100;

                                return (
                                    <Card
                                        key={request.id}
                                        className={`transition-all duration-200 hover:shadow-lg ${
                                            isCompatible
                                                ? 'ring-2 ring-green-200 bg-green-50/30'
                                                : ''
                                        }`}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${priorityConfig.bgColor}`}
                                                        >
                                                            <PriorityIcon
                                                                className={`h-5 w-5 ${priorityConfig.textColor}`}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-semibold text-gray-900">
                                                                    {
                                                                        request.title
                                                                    }
                                                                </h3>
                                                                <Badge
                                                                    className={
                                                                        priorityConfig.color
                                                                    }
                                                                >
                                                                    {
                                                                        priorityConfig.label
                                                                    }
                                                                </Badge>
                                                                {isCompatible && (
                                                                    <Badge className="bg-green-500">
                                                                        Compatible
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600 mb-3">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="h-4 w-4 text-red-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.bloodGroup
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Blood Type
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.estimatedTimeLeft
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Time Left
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-green-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.location
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Location
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-purple-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.currentPeople
                                                                    }
                                                                    /
                                                                    {
                                                                        request.maxPeople
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Donors
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Progress
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {Math.round(
                                                                    progressPercentage,
                                                                )}
                                                                % filled
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className={`h-3 rounded-full transition-all duration-300 ${
                                                                    progressPercentage >=
                                                                    80
                                                                        ? 'bg-green-500'
                                                                        : progressPercentage >=
                                                                            50
                                                                          ? 'bg-yellow-500'
                                                                          : 'bg-red-500'
                                                                }`}
                                                                style={{
                                                                    width: `${Math.min(progressPercentage, 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 lg:w-48">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/requests/${request.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Droplet className="h-12 w-12" />}
                            title="No requests found"
                            description="No blood donation requests match your current filters. Try adjusting your search criteria."
                            action={{
                                label: 'Clear Filters',
                                onClick: () => {
                                    setSearchTerm('');
                                    setPriorityFilter('all');
                                    setBloodGroupFilter('all');
                                },
                            }}
                        />
                    )}
                </TabsContent>

                <TabsContent value="recommended" className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-blue-800">
                                Personalized Recommendations
                            </h3>
                        </div>
                        <p className="text-sm text-blue-700">
                            These requests are recommended based on your blood
                            type ({userBloodGroup}) and urgent needs in your
                            area.
                        </p>
                    </div>

                    {getRecommendedRequests().length > 0 ? (
                        <div className="grid gap-6">
                            {getRecommendedRequests().map((request) => {
                                const priorityConfig = getPriorityConfig(
                                    request.priority,
                                );
                                const PriorityIcon = priorityConfig.icon;
                                const isCompatible = isCompatibleBloodGroup(
                                    request.bloodGroup,
                                );
                                const progressPercentage =
                                    (request.currentPeople /
                                        request.maxPeople) *
                                    100;

                                return (
                                    <Card
                                        key={request.id}
                                        className="ring-2 ring-blue-200 bg-blue-50/30 hover:shadow-lg transition-all duration-200"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className="bg-blue-500">
                                                    Recommended
                                                </Badge>
                                                {isCompatible && (
                                                    <Badge className="bg-green-500">
                                                        Perfect Match
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${priorityConfig.bgColor}`}
                                                        >
                                                            <PriorityIcon
                                                                className={`h-5 w-5 ${priorityConfig.textColor}`}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                {request.title}
                                                            </h3>
                                                            <p className="text-gray-600 mb-3">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="h-4 w-4 text-red-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.bloodGroup
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Blood Type
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.estimatedTimeLeft
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Time Left
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-green-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.location
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Location
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-purple-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.currentPeople
                                                                    }
                                                                    /
                                                                    {
                                                                        request.maxPeople
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Donors
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Progress
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {Math.round(
                                                                    progressPercentage,
                                                                )}
                                                                % filled
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${Math.min(progressPercentage, 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 lg:w-48">
                                                    <Button
                                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/requests/${request.id}/apply`}
                                                        >
                                                            Apply to Donate
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/requests/${request.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Heart className="h-12 w-12" />}
                            title="No recommendations available"
                            description="We don't have any personalized recommendations for you right now. Check back later or browse all active requests."
                            action={{
                                label: 'Browse All Requests',
                                onClick: () => setStatusFilter('active'),
                            }}
                        />
                    )}
                </TabsContent>

                <TabsContent value="urgent" className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="font-medium text-red-800">
                                Urgent Blood Requests
                            </h3>
                        </div>
                        <p className="text-sm text-red-700">
                            These requests require immediate attention and have
                            high priority status.
                        </p>
                    </div>

                    {mockRequests.filter((r) => r.priority === 'high').length >
                    0 ? (
                        <div className="grid gap-6">
                            {mockRequests
                                .filter((r) => r.priority === 'high')
                                .map((request) => {
                                    const isCompatible = isCompatibleBloodGroup(
                                        request.bloodGroup,
                                    );
                                    const progressPercentage =
                                        (request.currentPeople /
                                            request.maxPeople) *
                                        100;

                                    return (
                                        <Card
                                            key={request.id}
                                            className="border-red-200 bg-red-50/30 hover:shadow-lg transition-all duration-200"
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge className="bg-red-500 animate-pulse">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        URGENT
                                                    </Badge>
                                                    {isCompatible && (
                                                        <Badge className="bg-green-500">
                                                            Compatible
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="space-y-4 flex-1">
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                {request.title}
                                                            </h3>
                                                            <p className="text-gray-600 mb-3">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <Droplet className="h-4 w-4 text-red-500" />
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {
                                                                            request.bloodGroup
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Blood
                                                                        Type
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-orange-500" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-orange-600">
                                                                        {
                                                                            request.estimatedTimeLeft
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Critical
                                                                        Timeline
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-green-500" />
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {
                                                                            request.location
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Emergency
                                                                        Location
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4 text-purple-500" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-red-600">
                                                                        {request.maxPeople -
                                                                            request.currentPeople}{' '}
                                                                        still
                                                                        needed
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Urgent
                                                                        Need
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">
                                                                    Emergency
                                                                    Progress
                                                                </span>
                                                                <span className="text-sm text-red-600 font-medium">
                                                                    {Math.round(
                                                                        progressPercentage,
                                                                    )}
                                                                    % filled
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className="bg-red-500 h-3 rounded-full transition-all duration-300"
                                                                    style={{
                                                                        width: `${Math.min(progressPercentage, 100)}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 lg:w-48">
                                                        <Button
                                                            className="w-full bg-red-600 hover:bg-red-700 animate-pulse"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/requests/${request.id}/apply`}
                                                            >
                                                                RESPOND NOW
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-red-200"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/requests/${request.id}`}
                                                            >
                                                                Emergency
                                                                Details
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<AlertTriangle className="h-12 w-12" />}
                            title="No urgent requests"
                            description="There are currently no urgent blood requests. Thank you for being ready to help!"
                            action={{
                                label: 'View All Requests',
                                onClick: () => setStatusFilter('active'),
                            }}
                        />
                    )}
                </TabsContent>
            </Tabs>
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                            {
                                mockRequests.filter(
                                    (r) => r.priority === 'high',
                                ).length
                            }
                        </div>
                        <p className="text-sm text-gray-600">Urgent Requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {getRecommendedRequests().length}
                        </div>
                        <p className="text-sm text-gray-600">
                            Recommended for You
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {mockRequests.reduce(
                                (sum, r) =>
                                    sum + (r.maxPeople - r.currentPeople),
                                0,
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                            Donors Still Needed
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
