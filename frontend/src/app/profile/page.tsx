import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Camera, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfileSettings() {
    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Profile
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account information
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Picture
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src="/placeholder.svg"
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-lg font-semibold">
                                    JS
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="sm"
                                variant="outline"
                                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                            >
                                <Camera className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Badge variant="secondary" className="text-sm">
                                Member
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                                JPG, GIF or PNG. Max size of 2MB.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    defaultValue="John Smith"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    defaultValue="john.smith@email.com"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    defaultValue="+1234567890"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bloodGroup">Blood Group</Label>
                                <Select defaultValue="o-negative" disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="a-positive">
                                            A+
                                        </SelectItem>
                                        <SelectItem value="a-negative">
                                            A-
                                        </SelectItem>
                                        <SelectItem value="b-positive">
                                            B+
                                        </SelectItem>
                                        <SelectItem value="b-negative">
                                            B-
                                        </SelectItem>
                                        <SelectItem value="ab-positive">
                                            AB+
                                        </SelectItem>
                                        <SelectItem value="ab-negative">
                                            AB-
                                        </SelectItem>
                                        <SelectItem value="o-positive">
                                            O+
                                        </SelectItem>
                                        <SelectItem value="o-negative">
                                            O-
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">
                                    Date of Birth
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        className="pr-10"
                                        readOnly
                                    />
                                    <CalendarDays className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContact">
                                    Emergency Contact
                                </Label>
                                <Input
                                    id="emergencyContact"
                                    placeholder="Name and phone number"
                                    defaultValue="Jane Smith - +1234567891"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter your full address"
                                defaultValue="123 Main Street, City, State 12345"
                                rows={3}
                                readOnly
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
