import {
    House,
    Droplet,
    Calendar,
    Activity,
    Award,
    Heart,
    CircleAlert,
    Settings,
    BookOpen,
} from 'lucide-react';

export const sidebarItems = [
    { icon: House, label: 'Dashboard', href: '/member' },
    {
        icon: Droplet,
        label: 'Blood Requests',
        href: '/member/request',
    },
    {
        icon: BookOpen,
        label: 'Blog',
        href: '/member/blog',
    },
    {
        icon: Calendar,
        label: 'Appointments',
        href: '/member/appointment',
    },
    {
        icon: Activity,
        label: 'Health Profile',
        href: '/member/health-profile',
    },
    {
        icon: Award,
        label: 'Achievements',
        href: '/member/achievement',
    },
    {
        icon: Heart,
        label: 'Impact Tracker',
        href: '/member/impact',
    },
    {
        icon: CircleAlert,
        label: 'Emergency Alerts',
        href: '/member/emergency',
    },
    { icon: Settings, label: 'Settings', href: '/member/profile' },
];

export const requests = [
    {
        id: 'req-001',
        title: 'Emergency Surgery Blood Needed',
        blood_group: 'O+',
        time: '08:00 - 18:00',
        compatible: true,
        staff_name: 'Dr. Smith',
    },
    {
        id: 'req-003',
        title: 'Accident Victim Needs Blood',
        blood_group: 'O+',
        time: '10:00 - 16:00',
        compatible: true,
        staff_name: 'Dr. Wilson',
    },
];

export const actions = [
    {
        icon: Calendar,
        title: 'Schedule Donation',
        color: 'bg-green-50 text-green-600',
        href: '/member/appointment',
    },
    {
        icon: Droplet,
        title: 'View Requests',
        color: 'bg-red-50 text-red-500',
        href: '/member/request',
    },
    {
        icon: Activity,
        title: 'Health Records',
        color: 'bg-purple-50 text-purple-600',
        href: '/member/health-profile',
    },
];

export const donations = [
    {
        type: 'Whole Blood',
        amount: '450ml',
        date: '4/15/2023',
    },
    {
        type: 'Plasma',
        amount: '600ml',
        date: '4/15/2023',
    },
    {
        type: 'Platelets',
        amount: '200ml',
        date: '4/15/2023',
    },
];

export const appointments = [
    {
        type: 'Blood Donation',
        date: '7/10/2025',
        time: '10:00 AM',
        status: 'Confirm',
        statusColor: 'bg-green-100 text-green-800',
    },
    {
        type: 'Health Check',
        date: '7/10/2025',
        time: '10:00 AM',
        status: 'Pending',
        statusColor: 'bg-yellow-100 text-yellow-800',
    },
];

export const mockRequests = [
    {
        id: '1',
        title: 'Emergency O- needed for surgery',
        bloodGroup: 'O-',
        priority: 'high',
        startDate: '2025-06-01',
        endDate: '2025-06-03',
        maxPeople: 5,
        currentPeople: 2,
        createdAt: '2025-05-30',
        description:
            'Urgent need for O- blood for multiple emergency surgeries.',
        estimatedTimeLeft: '2 days',
        applications: 3,
        createdBy: 'staff1',
    },
    {
        id: '2',
        title: 'Regular donation drive',
        bloodGroup: 'All',
        priority: 'medium',
        startDate: '2025-06-05',
        endDate: '2025-06-10',
        maxPeople: 20,
        currentPeople: 19,
        createdAt: '2025-05-29',
        description:
            'Community blood drive to replenish our general inventory.',
        estimatedTimeLeft: '5 days',
        applications: 10,
        createdBy: 'staff2',
    },
    {
        id: '3',
        title: 'Platelets needed for cancer patients',
        bloodGroup: 'A+',
        priority: 'medium',
        startDate: '2025-06-08',
        endDate: '2025-06-15',
        maxPeople: 10,
        currentPeople: 6,
        createdAt: '2025-05-28',
        description: 'Platelet donations needed for ongoing cancer treatments.',
        estimatedTimeLeft: '8 days',
        applications: 5,
        createdBy: 'staff1',
    },
    {
        id: '4',
        title: 'Blood needed for accident victims',
        bloodGroup: 'B+',
        priority: 'high',
        startDate: '2025-06-02',
        endDate: '2025-06-05',
        maxPeople: 15,
        currentPeople: 7,
        createdAt: '2025-05-31',
        description: 'Support for ongoing treatment of accident victims.',
        estimatedTimeLeft: '3 days',
        applications: 0,
        createdBy: 'staff2',
    },
];

// sample-data for appointment page
export const summaryStats = {
    totalDonations: 2,
    lifetimeDonations: 'Lifetime donations',
    nextMilestone: '4/10 to next milestone',
    bloodDonated: '600ml',
    totalVolume: 'Total volume donated',
    livesEquivalent: 'Equivalent to saving 15 lives',
    nextEligible: 'Jun 15',
    nextDonationDate: 'Next donation date',
    weeksRemaining: '2 weeks remaining',
};

export const upcomingAppointments = [
    {
        id: 1,
        title: 'Emergency O- needed for surgery',
        status: 'Confirmed',
        priority: 'High Priority',
        bloodGroup: 'O-',
        date: '6/3/2025',
        time: '10:00 AM',
        duration: '45-60 minutes',
        notes: 'Eat well and stay hydrated before your appointment',
        timeUntil: 'Past',
    },
    {
        id: 2,
        title: 'Regular donation drive',
        status: 'Pending',
        priority: 'Medium Priority',
        bloodGroup: 'All',
        date: '6/15/2025',
        time: '2:30 PM',
        duration: '45-60 minutes',
        notes: 'Bring a valid ID and eat a healthy meal',
        timeUntil: 'In 8 days',
    },
];

export const completedAppointments = [
    {
        id: 3,
        title: 'Regular blood donation',
        status: 'Completed',
        priority: 'Standard',
        bloodGroup: 'O-',
        date: '5/15/2025',
        time: '11:00 AM',
        duration: '45 minutes',
        notes: 'Successful donation - 450ml collected',
    },
    {
        id: 4,
        title: 'Emergency donation request',
        status: 'Completed',
        priority: 'High Priority',
        bloodGroup: 'O-',
        date: '4/20/2025',
        time: '3:15 PM',
        duration: '50 minutes',
        notes: 'Critical need fulfilled - patient stable',
    },
];

// sample data for health profile page
export const mockHealthRecords = [
    {
        id: '1',
        date: '2025-06-03',
        appointmentId: 'apt-001',
        temperature: 36.8,
        weight: 75,
        bloodPressure: '120/80',
        pulse: 72,
        hemoglobin: 14.2,
        status: 'approved',
        notes: 'All vitals normal. Approved for donation.',
    },
    {
        id: '2',
        date: '2025-04-15',
        appointmentId: 'apt-002',
        temperature: 36.5,
        weight: 74,
        bloodPressure: '118/78',
        pulse: 68,
        hemoglobin: 13.8,
        status: 'approved',
        notes: 'Excellent health parameters.',
    },
    {
        id: '3',
        date: '2025-02-20',
        appointmentId: 'apt-003',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '4',
        date: '2025-02-20',
        appointmentId: 'apt-004',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '5',
        date: '2025-02-20',
        appointmentId: 'apt-004',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '6',
        date: '2025-02-20',
        appointmentId: 'apt-005',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '7',
        date: '2025-02-20',
        appointmentId: 'apt-006',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
    {
        id: '8',
        date: '2025-02-20',
        appointmentId: 'apt-007',
        temperature: 37.1,
        weight: 73,
        bloodPressure: '125/82',
        pulse: 75,
        hemoglobin: 14.0,
        status: 'approved',
        notes: 'Slightly elevated temperature but within acceptable range.',
    },
];

export const mockHealthTrends = {
    weight: [73, 74, 75],
    hemoglobin: [14.0, 13.8, 14.2],
    bloodPressure: [
        { systolic: 125, diastolic: 82 },
        { systolic: 118, diastolic: 78 },
        { systolic: 120, diastolic: 80 },
    ],
};
