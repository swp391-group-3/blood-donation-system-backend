'use client';
import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Package2,
    Search,
    MoreVertical,
    CalendarIcon,
    QrCode,
    Printer,
    Download,
    ShieldAlert,
    Plus,
    Droplet,
    AlertCircle,
    Clock,
    User,
    Activity,
    TrendingUp,
    TrendingDown,
    Eye,
    Edit,
    RefreshCw,
    X,
    CheckCircle,
    AlertTriangle,
    Info,
    Zap,
    Heart,
    Shield,
    Thermometer,
    ArrowLeft,
} from 'lucide-react';
import {
    mockBloodBags,
    bloodTypeStats,
    bloodTypes,
    urgencyLevels,
} from '../../../../constants/sample-data';
import { useForm } from 'react-hook-form';
import { TabsContent } from '@radix-ui/react-tabs';

export const requestBloodSchema = z.object({
    bloodType: z.string().min(1, 'Please select the blood type'),
    quantity: z.number().min(1, 'Please input the quantity'),
    urgency: z.string().min(1, 'Please select the urgency of the request'),
    reason: z.string().min(1, 'Input the medical reason for this request'),
    date: z.string().min(1, 'Please select the date of the donation'),
    terms: z.boolean().refine((val) => val, 'You must confirm legitimacy'),
    emergency: z.boolean().refine((val) => val, 'Acknowledge emergency policy'),
});
export type RequestBloodFormType = z.infer<typeof requestBloodSchema>;

export default function BloodBagsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [bloodBags, setBloodBags] = useState(mockBloodBags);
    const [date, setDate] = useState<Date>();
    const [role, setRole] = useState<string | null>(null);
    const [requestFormOpen, setRequestFormOpen] = useState(false);
    const [selectedBloodBag, setSelectedBloodBag] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [sortBy, setSortBy] = useState('collectionDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const form = useForm<RequestBloodFormType>({
        resolver: zodResolver(requestBloodSchema),
        defaultValues: {
            bloodType: 'A+',
            quantity: 1,
            urgency: 'normal',
            reason: '',
            date: undefined,
            terms: false,
            emergency: false,
        },
    });

    const onSubmit = (data: RequestBloodFormType) => {
        // come in future
        setRequestFormOpen(false);
    };

    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Reserved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Used':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Expiring Soon':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Expired':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDemandColor = (demand: string) => {
        switch (demand) {
            case 'very-high':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            default:
                return <div className="h-4 w-4" />;
        }
    };

    const handleRequestBlood = (bag: any) => {
        setSelectedBloodBag(bag);
        setRequestFormOpen(true);
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        // come in future
    };

    const addFilter = (filterType: string, value: string) => {
        const filterKey = `${filterType}:${value}`;
        if (!activeFilters.includes(filterKey)) {
            setActiveFilters([...activeFilters, filterKey]);
        }
    };

    return (
        <div className="space-y-8 p-6 bg-gradient-to-br from-red-50 via-white to-pink-50 min-h-screen">
            <div className="relative overflow-hidden rounded-2xl bg-red-600 p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Blood Bank Management
                        </h1>
                        <p className="text-red-100 text-lg">
                            Hospital blood inventory tracking and management
                            system
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {bloodBags.length} Total Units
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    4 Demand High
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog
                            open={requestFormOpen}
                            onOpenChange={setRequestFormOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-white text-red-600 hover:bg-gray-100">
                                    <Droplet className="mr-2 h-4 w-4" />
                                    Request Blood
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Droplet className="h-5 w-5 text-red-600" />
                                        Request Blood
                                    </DialogTitle>
                                    <DialogDescription>
                                        Fill out this form to request blood for
                                        medical purposes. All requests are
                                        reviewed by our medical team.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="bloodType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Blood Type
                                                            </FormLabel>
                                                            <Select>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Blood Type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {bloodTypes.map(
                                                                        (
                                                                            type,
                                                                        ) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    type
                                                                                }
                                                                            >
                                                                                {
                                                                                    type
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="quantity"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Quantity (units)
                                                                *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    {...field}
                                                                    value={
                                                                        field.value ??
                                                                        1
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        field.onChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                ></Input>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="urgency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Urgency Level *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select the urgent level" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {urgencyLevels.map(
                                                                    (item) => (
                                                                        <SelectItem
                                                                            key={
                                                                                item.value
                                                                            }
                                                                            value={
                                                                                item.value
                                                                            }
                                                                        >
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="reason"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Medical Reason
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                rows={3}
                                                                placeholder="Please provide the request reason"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Require By *
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="dates"
                                                                        className={
                                                                            'w-full justify-start text-left font-normal' +
                                                                            (!field.value
                                                                                ? ' text-muted-foreground'
                                                                                : '')
                                                                        }
                                                                    >
                                                                        {dateRange?.from &&
                                                                        dateRange?.to
                                                                            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                                                                            : 'Select Date'}
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <Calendar
                                                                    mode="range"
                                                                    selected={
                                                                        dateRange
                                                                    }
                                                                    captionLayout="dropdown"
                                                                    onSelect={(
                                                                        dateRange,
                                                                    ) =>
                                                                        setDateRange(
                                                                            dateRange,
                                                                        )
                                                                    }
                                                                    className="rounded-lg border shadow-sm"
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <FormField
                                                    control={form.control}
                                                    name="terms"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                    id="terms"
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-medium leading-none">
                                                                I confirm this
                                                                is a legitimate
                                                                medical request
                                                            </FormLabel>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="emergency"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={
                                                                        field.value
                                                                    }
                                                                    onCheckedChange={
                                                                        field.onChange
                                                                    }
                                                                    id="emergency"
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-medium leading-none">
                                                                I understand
                                                                that false
                                                                emergency
                                                                requests may
                                                                result in
                                                                account
                                                                suspension
                                                            </FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setRequestFormOpen(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Submit Request
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {bloodTypeStats.map((stat) => (
                    <Card
                        key={stat.type}
                        className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-red-50"></div>
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <Droplet className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {stat.type}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Blood Type
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Available
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {stat.available}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Total
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {stat.total}
                                    </span>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Demand
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'capitalize',
                                                getDemandColor(stat.demand),
                                            )}
                                        >
                                            {stat.demand.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by ID, donor name, blood type"
                            type="search"
                            className="pl-10 h-9 border-gray-200 focus:border-red-300 focus:ring-red-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="Available">
                                    Available
                                </SelectItem>
                                <SelectItem value="Reserved">
                                    Reserved
                                </SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Expiring Soon">
                                    Expiring Soon
                                </SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by blood type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Blood Types
                                </SelectItem>
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
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Priorities
                                </SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Blood Units Registry 10 Results
                    </h2>
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                    >
                        5 Available
                    </Badge>
                </div>
            </div>

            <Tabs
                value={viewMode}
                onValueChange={(value) =>
                    setViewMode(value as 'table' | 'grid')
                }
            >
                <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                    <Card className="border-0 shadow-lg overflow-hidden p-4 mt-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">
                                            Unit Info
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Blood Type
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Donor
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Collection
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Expiry Status
                                        </TableHead>
                                        <TableHead className="font-semibold text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockBloodBags.map((bag) => {
                                        return (
                                            <TableRow
                                                key={bag.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {bag.id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {bag.volume}ml
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-red-50 text-red-700 border-red-200 font-bold"
                                                    >
                                                        {bag.bloodType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {bag.donorName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {bag.donorId}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-900">
                                                        {bag.collectionDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-4">
                                                    <div className="space-y-2">
                                                        <div className="text-sm text-gray-900">
                                                            {bag.expiryDate}
                                                        </div>
                                                        <Progress 
                                                            value ={100}
                                                            className="h-2 [&>div]:bg-red-500"
                                                        />
                                                            
                                                        <div className="text-xs font-medium text-red-600">
                                                            Expired
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex justify-center items-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'flex items-center gap-1 w-fit',
                                                            getStatusColor(
                                                                bag.status,
                                                            ),
                                                        )}
                                                    >
                                                        {bag.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                                <Droplet className="h-4 w-4" />
                                                                Request This
                                                                Unit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Edit className="h-4 w-4" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <RefreshCw className="h-4 w-4" />
                                                                Update Status
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 ">
                        {mockBloodBags.map((bag) => {
                            return (
                                <Card
                                    key={bag.id}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Package2 className="h-5 w-5 text-red-600" />
                                                    {bag.id}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {bag.donorName}
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-800 border-red-200 font-bold text-lg"
                                            >
                                                {bag.bloodType}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-gray-500">
                                                    Volume
                                                </p>
                                                <p className="font-medium">
                                                    {bag.volume}ml
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-500">
                                                    Collection
                                                </p>
                                                <p className="font-medium">
                                                    {bag.collectionDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">
                                                    Expiry Status
                                                </span>
                                                <span
                                                    className="text-xs font-medium text-red-600"
                                                >
                                                    Expired
                                                </span>
                                            </div>
                                            <Progress
                                                value={100}
                                                className="h-2 [&>div]:bg-red-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'flex items-center gap-1',
                                                    getStatusColor(bag.status),
                                                )}
                                            >
                                                {bag.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={getPriorityColor(
                                                    bag.priority,
                                                )}
                                            >
                                                {bag.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-red-600 hover:bg-red-700"
                                                onClick={() =>
                                                    handleRequestBlood(bag)
                                                }
                                            >
                                                <Droplet className="h-3 w-3 mr-1" />
                                                Request
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
