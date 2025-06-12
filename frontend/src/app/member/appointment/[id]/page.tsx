import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    TimerOff,
    Droplets,
    Users,
    CalendarDays,
    Clock,
    AlertTriangle,
    CheckCircle,
    NotebookIcon,
} from 'lucide-react';

export default function BloodRequestPage() {
    return (
        <div className="flex-1 p-10 bg-zinc-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-zinc-900">
                            Emergency O- needed for surgery
                        </h1>
                        <Badge
                            className="bg-green-100 text-green-800 border-green-200"
                        >
                            Confirm
                        </Badge>
                        <Badge
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                        >
                            High Priority
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">Appointment ID: 1</p>
                </div>

                <div className="flex gap-4 h-full">
                    <div className="flex-1 space-y-4">
                        <Card className="w-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold mb-1">
                                    Appointment Details
                                </CardTitle>
                                <p className="text-zinc-600 text-sm leading-relaxed mb-0">
                                    We urgently need O- blood donors for
                                    multiple emergency surgeries scheduled this
                                    week. Your donation could save lives.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <Droplets className="h-4 w-4 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">
                                                Blood Type
                                            </p>
                                            <p className="font-medium text-zinc-900">
                                                O+
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Users className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">
                                                5/5
                                            </p>
                                            <p className="font-medium text-zinc-900">
                                                Donors
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <CalendarDays className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">
                                                Donation Period
                                            </p>
                                            <p className="font-medium text-zinc-900">
                                                6/1/2025 - 6/3/2025
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">
                                                Time
                                            </p>
                                            <p className="font-medium text-zinc-900">
                                                8:00 - 18:00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <TimerOff className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-1">
                                            Estimated Time
                                        </p>
                                        <p className="font-medium text-zinc-900">
                                            45-50 minutes
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Medical Notes:
                                </CardTitle>
                                <p className="text-sm text-zinc-500">
                                    Please ensure you meet all requirements
                                    before applying
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-zinc-700">
                                            Must be between 18-65 years old
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-zinc-700">
                                            Minimum weight of 50kg
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-zinc-700">
                                            No recent illness or medication
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-zinc-700">
                                            No tattoos or piercings in the last
                                            6 months
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                                <span className="font-medium">
                                    Cannot Apply
                                </span>
                                <br />
                                This donation period has ended
                            </AlertDescription>
                        </Alert>
                        
                    </div>  
                </div>
            </div>
        </div>
    );
}
