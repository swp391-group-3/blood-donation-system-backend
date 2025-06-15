'use client';
import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
} from '../../../../constants/sample-data';

export default function BloodBagsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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
    const router = useRouter();

    const filteredBloodBags = bloodBags.filter((bag) => {
        const matchesSearch =
            searchTerm === '' ||
            bag.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bag.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bag.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bag.storage.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply status filter
        const matchesStatus =
            statusFilter === 'all' || bag.status === statusFilter;

        // Apply blood type filter
        const matchesBloodType =
            bloodTypeFilter === 'all' || bag.bloodType === bloodTypeFilter;

        // Apply priority filter
        const matchesPriority =
            priorityFilter === 'all' || bag.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesBloodType &&
            matchesPriority
        );
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Available':
                return <CheckCircle className="h-4 w-4" />;
            case 'Reserved':
                return <Clock className="h-4 w-4" />;
            case 'Used':
                return <Activity className="h-4 w-4" />;
            case 'Expiring Soon':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

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

    const getExpiryProgress = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const collectionDate = new Date(
            today.getTime() - 30 * 24 * 60 * 60 * 1000,
        ); // Assume 30 days shelf life
        const totalDays = Math.ceil(
            (expiry.getTime() - collectionDate.getTime()) /
                (1000 * 60 * 60 * 24),
        );
        const remainingDays = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const progress = Math.max(
            0,
            Math.min(100, (remainingDays / totalDays) * 100),
        );

        return {
            progress,
            remainingDays,
            isExpiringSoon: remainingDays <= 7,
            isExpired: remainingDays <= 0,
        };
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

    const removeFilter = (filterKey: string) => {
        setActiveFilters(activeFilters.filter((f) => f !== filterKey));

        // Reset the corresponding filter state
        const [type, value] = filterKey.split(':');
        switch (type) {
            case 'status':
                setStatusFilter('all');
                break;
            case 'bloodType':
                setBloodTypeFilter('all');
                break;
            case 'priority':
                setPriorityFilter('all');
                break;
        }
    };

    const clearAllFilters = () => {
        setActiveFilters([]);
        setStatusFilter('all');
        setBloodTypeFilter('all');
        setPriorityFilter('all');
        setSearchTerm('');
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
                            Hospital blood inventory tracking and management system
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
                                        Fill out this form to request blood
                                        for medical purposes. All requests
                                        are reviewed by our medical team.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmitRequest}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="bloodType">
                                                    Blood Type *
                                                </Label>
                                                <Select defaultValue="A+">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select blood type" />
                                                    </SelectTrigger>
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
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="quantity">
                                                    Quantity (units) *
                                                </Label>
                                                <Input
                                                    id="quantity"
                                                    type="number"
                                                    defaultValue="1"
                                                    min="1"
                                                    max="10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="urgency">
                                                Urgency Level *
                                            </Label>
                                            <Select defaultValue="normal">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select urgency level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="emergency">
                                                        🚨 Emergency -
                                                        Immediate (Life
                                                        threatening)
                                                    </SelectItem>
                                                    <SelectItem value="urgent">
                                                        ⚡ Urgent - Within
                                                        24 hours
                                                    </SelectItem>
                                                    <SelectItem value="normal">
                                                        📅 Normal - Within a
                                                        week
                                                    </SelectItem>
                                                    <SelectItem value="planned">
                                                        📋 Planned -
                                                        Scheduled procedure
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="department">
                                                Department/Ward *
                                            </Label>
                                            <Input
                                                id="department"
                                                placeholder="e.g., Emergency Department, Surgery Ward"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reason">
                                                Medical Reason *
                                            </Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Please provide details about the medical condition or procedure requiring blood transfusion"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date">
                                                Required By *
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !date &&
                                                                'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date
                                                            ? format(
                                                                    date,
                                                                    'PPP',
                                                                )
                                                            : 'Select required date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="terms" />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none"
                                                >
                                                    I confirm this is a
                                                    legitimate medical
                                                    request
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="emergency" />
                                                <label
                                                    htmlFor="emergency"
                                                    className="text-sm font-medium leading-none"
                                                >
                                                    I understand that false
                                                    emergency requests may
                                                    result in account
                                                    suspension
                                                </label>
                                            </div>
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
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Blood Type Distribution Dashboard */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {bloodTypeStats.map((stat) => (
                    <Card
                        key={stat.type}
                        className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50"></div>
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
                                {getTrendIcon(stat.trend)}
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
                                        Reserved
                                    </span>
                                    <span className="font-bold text-blue-600">
                                        {stat.reserved}
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

                                <div className="pt-2 border-t">
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

            {/* Enhanced Filters and Search */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by ID, donor name, blood type, or storage..."
                                    className="pl-10 h-12 border-gray-200 focus:border-red-300 focus:ring-red-200"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        setStatusFilter(value);
                                        if (value !== 'all')
                                            addFilter('status', value);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] h-12">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value="Available">
                                            ✅ Available
                                        </SelectItem>
                                        <SelectItem value="Reserved">
                                            🔒 Reserved
                                        </SelectItem>
                                        <SelectItem value="Used">
                                            📋 Used
                                        </SelectItem>
                                        <SelectItem value="Expiring Soon">
                                            ⚠️ Expiring Soon
                                        </SelectItem>
                                        <SelectItem value="Expired">
                                            ❌ Expired
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={bloodTypeFilter}
                                    onValueChange={(value) => {
                                        setBloodTypeFilter(value);
                                        if (value !== 'all')
                                            addFilter('bloodType', value);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] h-12">
                                        <SelectValue placeholder="Filter by blood type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Blood Types
                                        </SelectItem>
                                        <SelectItem value="A+">
                                            🩸 A+
                                        </SelectItem>
                                        <SelectItem value="A-">
                                            🩸 A-
                                        </SelectItem>
                                        <SelectItem value="B+">
                                            🩸 B+
                                        </SelectItem>
                                        <SelectItem value="B-">
                                            🩸 B-
                                        </SelectItem>
                                        <SelectItem value="AB+">
                                            🩸 AB+
                                        </SelectItem>
                                        <SelectItem value="AB-">
                                            🩸 AB-
                                        </SelectItem>
                                        <SelectItem value="O+">
                                            🩸 O+
                                        </SelectItem>
                                        <SelectItem value="O-">
                                            🩸 O-
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={priorityFilter}
                                    onValueChange={(value) => {
                                        setPriorityFilter(value);
                                        if (value !== 'all')
                                            addFilter('priority', value);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] h-12">
                                        <SelectValue placeholder="Filter by priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Priorities
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            🚨 Urgent
                                        </SelectItem>
                                        <SelectItem value="high">
                                            ⚡ High
                                        </SelectItem>
                                        <SelectItem value="normal">
                                            📋 Normal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-sm text-gray-600">
                                    Active filters:
                                </span>
                                {activeFilters.map((filter) => {
                                    const [type, value] = filter.split(':');
                                    return (
                                        <Badge
                                            key={filter}
                                            variant="secondary"
                                            className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200"
                                        >
                                            {type}: {value}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    removeFilter(filter)
                                                }
                                            />
                                        </Badge>
                                    );
                                })}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Blood Units Registry ({filteredBloodBags.length}{' '}
                        results)
                    </h2>
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                    >
                        {
                            filteredBloodBags.filter(
                                (bag) => bag.status === 'Available',
                            ).length
                        }{' '}
                        Available
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'table' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                    >
                        Table
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </Button>
                </div>
            </div>

            {/* Blood Bags Display */}
            {filteredBloodBags.length === 0 ? (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-12">
                        title="No blood units found" description="Try adjusting
                        your search criteria or filters to find what you're
                        looking for."
                    </CardContent>
                </Card>
            ) : viewMode === 'table' ? (
                <Card className="border-0 shadow-lg overflow-hidden">
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
                                    <TableHead className="font-semibold">
                                        Status
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        Storage
                                    </TableHead>
                                    <TableHead className="text-right font-semibold">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBloodBags.map((bag) => {
                                    const expiryInfo = getExpiryProgress(
                                        bag.expiryDate,
                                    );
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
                                                    className="bg-red-50 text-red-800 border-red-200 font-bold"
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
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="text-sm text-gray-900">
                                                        {bag.expiryDate}
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={cn(
                                                                'h-2 rounded-full transition-all',
                                                                expiryInfo.isExpired
                                                                    ? 'bg-red-500'
                                                                    : expiryInfo.isExpiringSoon
                                                                      ? 'bg-amber-500'
                                                                      : 'bg-green-500',
                                                            )}
                                                            style={{
                                                                width: `${expiryInfo.progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div
                                                        className={cn(
                                                            'text-xs font-medium',
                                                            expiryInfo.isExpired
                                                                ? 'text-red-600'
                                                                : expiryInfo.isExpiringSoon
                                                                  ? 'text-amber-600'
                                                                  : 'text-green-600',
                                                        )}
                                                    >
                                                        {expiryInfo.isExpired
                                                            ? 'Expired'
                                                            : expiryInfo.isExpiringSoon
                                                              ? `${expiryInfo.remainingDays} days left`
                                                              : `${expiryInfo.remainingDays} days remaining`}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'flex items-center gap-1 w-fit',
                                                        getStatusColor(
                                                            bag.status,
                                                        ),
                                                    )}
                                                >
                                                    {getStatusIcon(bag.status)}
                                                    {bag.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Thermometer className="h-3 w-3" />
                                                    {bag.storage}
                                                </div>
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
                                                        {role === 'member' &&
                                                            bag.status ===
                                                                'Available' && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleRequestBlood(
                                                                            bag,
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 text-red-600"
                                                                >
                                                                    <Droplet className="h-4 w-4" />
                                                                    Request This
                                                                    Unit
                                                                </DropdownMenuItem>
                                                            )}
                                                        {(role === 'staff' ||
                                                            role ===
                                                                'admin') && (
                                                            <>
                                                                <DropdownMenuItem className="flex items-center gap-2">
                                                                    <Edit className="h-4 w-4" />
                                                                    Edit Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2">
                                                                    <RefreshCw className="h-4 w-4" />
                                                                    Update
                                                                    Status
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2">
                                                                    <Printer className="h-4 w-4" />
                                                                    Print Label
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBloodBags.map((bag) => {
                        const expiryInfo = getExpiryProgress(bag.expiryDate);
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
                                                className={cn(
                                                    'text-xs font-medium',
                                                    expiryInfo.isExpired
                                                        ? 'text-red-600'
                                                        : expiryInfo.isExpiringSoon
                                                          ? 'text-amber-600'
                                                          : 'text-green-600',
                                                )}
                                            >
                                                {expiryInfo.isExpired
                                                    ? 'Expired'
                                                    : expiryInfo.isExpiringSoon
                                                      ? `${expiryInfo.remainingDays} days left`
                                                      : `${expiryInfo.remainingDays} days remaining`}
                                            </span>
                                        </div>
                                        <Progress
                                            value={expiryInfo.progress}
                                            className={cn(
                                                'h-2',
                                                expiryInfo.isExpired
                                                    ? '[&>div]:bg-red-500'
                                                    : expiryInfo.isExpiringSoon
                                                      ? '[&>div]:bg-amber-500'
                                                      : '[&>div]:bg-green-500',
                                            )}
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
                                            {getStatusIcon(bag.status)}
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

                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Thermometer className="h-3 w-3" />
                                        {bag.storage}
                                    </div>

                                    {bag.notes && (
                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                            {bag.notes}
                                        </p>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                        {role === 'member' &&
                                            bag.status === 'Available' && (
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
                                            )}
                                        {(role === 'staff' ||
                                            role === 'admin') && (
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Emergency Request CTA for Members */}
            {role === 'member' && (
                <Card className="border-2 border-dashed border-red-300 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <Zap className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-red-800 mb-2">
                                    Need Blood Urgently?
                                </h3>
                                <p className="text-red-700 mb-4">
                                    If you or someone you know needs blood
                                    urgently, create a detailed blood request
                                    that will be prioritized by our medical
                                    team.
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                        router.push(
                                            '/dashboard/requests/create',
                                        )
                                    }
                                >
                                    <AlertCircle className="mr-2 h-5 w-5" />
                                    Create Urgent Blood Request
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
