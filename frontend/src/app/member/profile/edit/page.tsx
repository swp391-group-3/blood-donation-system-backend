'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Camera, User } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
    fullName: z.string().min(2, {
        message: 'Full name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    phoneNumber: z.string().min(10, {
        message: 'Phone number must be at least 10 digits.',
    }),
    bloodGroup: z.string({
        required_error: 'Please select a blood group.',
    }),
    dateOfBirth: z.date({
        required_error: 'Please select your date of birth.',
    }),
    emergencyContact: z.string().min(5, {
        message: 'Emergency contact must be at least 5 characters.',
    }),
    address: z.string().min(10, {
        message: 'Address must be at least 10 characters.',
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultValues: Partial<ProfileFormValues> = {
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phoneNumber: '+1234567890',
    bloodGroup: 'O-',
    emergencyContact: 'Jane Smith - +1234567891',
    address: '123 Main Street, City, State 12345',
};

export default function EditProfilePage() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    function onSubmit(data: ProfileFormValues) {
        console.log(data);
        // Handle form submission here
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    {/* Profile Picture Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Picture
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="text-lg">
                                    JS
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Camera className="h-4 w-4" />
                                    Change Photo
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    JPG, GIF or PNG. Max size of 2MB.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and contact
                                information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your full name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="Enter your email address"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Phone Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your phone number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="bloodGroup"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Blood Group
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select blood group" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="A+">
                                                                A+
                                                            </SelectItem>
                                                            <SelectItem value="A-">
                                                                A-
                                                            </SelectItem>
                                                            <SelectItem value="B+">
                                                                B+
                                                            </SelectItem>
                                                            <SelectItem value="B-">
                                                                B-
                                                            </SelectItem>
                                                            <SelectItem value="AB+">
                                                                AB+
                                                            </SelectItem>
                                                            <SelectItem value="AB-">
                                                                AB-
                                                            </SelectItem>
                                                            <SelectItem value="O+">
                                                                O+
                                                            </SelectItem>
                                                            <SelectItem value="O-">
                                                                O-
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>
                                                        Date of Birth
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value &&
                                                                            'text-muted-foreground',
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            'MM/dd/yyyy',
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={(
                                                                    date,
                                                                ) =>
                                                                    date >
                                                                        new Date() ||
                                                                    date <
                                                                        new Date(
                                                                            '1900-01-01',
                                                                        )
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="emergencyContact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Emergency Contact
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter emergency contact details"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your full address"
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-4">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Notification settings coming soon...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy</CardTitle>
                            <CardDescription>
                                Manage your privacy preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Privacy settings coming soon...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Update your security settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Security settings coming soon...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
