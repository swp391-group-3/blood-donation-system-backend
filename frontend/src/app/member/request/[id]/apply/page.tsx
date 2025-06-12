'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {Form, FormControl, FormItem, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    CheckCircle,
    Droplet,
    ArrowLeft,
    ArrowRight,
    Shield,
    Heart,
    Clock,
    AlertTriangle,
    Loader2,
    Calendar,
} from 'lucide-react';
import {
    questionnaire,
    mockRequest,
} from '../../../../../../constants/sample-data';
import Link from 'next/link';


const preDonationSchema = z.array(z.string().min(1, "Invalid answer field"))

type PreDonationFormData = z.infer<typeof preDonationSchema>;

export default function PreDonationSurveyPage() {
    const form = useForm<z.infer<typeof preDonationSchema>>({
        resolver: zodResolver(preDonationSchema)
    })

    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const formEndRef = useRef<HTMLDivElement>(null)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
        getValues,
    } = useForm<PreDonationFormData>({
        resolver: zodResolver(preDonationSchema),
        mode: 'onChange',
    });

    const watchedFields = watch();
    const filledFields = Object.values(watchedFields).filter(
        (value) => typeof value === 'string' && value.trim().length > 0,
    ).length;
    const progressPercentage = (filledFields / questionnaire.length) * 100;

    const getQuestionStatus = (questionId: string) => {
        const value = watchedFields[questionId as keyof PreDonationFormData];
        if (!value || value.length === 0) return 'empty';
        return 'complete';
    };
    function handleSubmitApply() {
        // come in future
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="p-2">
                    <Link href="/member/request">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pre-Donation Health Survey
                    </h1>
                    <p className="text-zinc-500">
                        Complete the detailed health questionnaire for blood
                        donation eligibility
                    </p>
                </div>
            </div>

            <Card className="rounded-2xl shadow-lg border border-zinc-200 bg-white">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-semibold text-zinc-800 tracking-tight">
                            Survey Progress
                        </span>
                        <span className="text-sm text-zinc-500">
                            {filledFields} of {questionnaire.length} questions
                            answered
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="h-3 rounded-full bg-zinc-100 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600 [&>div]:rounded-full"
                    />
                    <div className="flex justify-between mt-4">
                        <span className="text-xs font-medium transition-colors">
                            Health Survey
                        </span>
                        <span className="text-xs font-medium transition-colors">
                            Confirmation
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-red-500" />
                        {mockRequest.title}
                    </CardTitle>
                    <CardDescription>{mockRequest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                            <Droplet className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    Blood Group
                                </p>
                                <p className="text-sm text-zinc-600">
                                    {mockRequest.bloodGroup}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    Donation Period
                                </p>
                                <p className="text-sm text-zinc-600">
                                    {new Date(
                                        mockRequest.startDate,
                                    ).toLocaleDateString()}{' '}
                                    -{' '}
                                    {new Date(
                                        mockRequest.endDate,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium">Priority</p>
                                <Badge className="bg-red-500">
                                    {mockRequest.priority
                                        .charAt(0)
                                        .toUpperCase() +
                                        mockRequest.priority.slice(1)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <Clock className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium">Time</p>
                                <p className="text-sm text-zinc-600">
                                    8:00 - 18:00
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-500" />
                            Pre-Donation Health Survey
                        </CardTitle>
                        <CardDescription>
                            Please provide answers to all 10 questions. This
                            information helps ensure the safety of both donors
                            and recipients.
                        </CardDescription>
                    </CardHeader>
                </Card>

                {questionnaire.map((question, index) => {
                    const status = getQuestionStatus(question.id);
                    return (
                        <Card
                            key={question.id}
                            className={`border-l-4 transition-all duration-300 ${
                                status === 'complete'
                                    ? 'border-l-green-500'
                                    : 'border-l-blue-200'
                            } ${activeQuestion === index ? 'ring-2 ring-blue-200' : ''}`}
                        >
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            status === 'complete'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                        }`}
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">
                                            {question.question}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {question.helpText}
                                        </CardDescription>
                                    </div>
                                </div>
                                {status === 'complete' && (
                                    <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200"
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Complete
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={handleSubmitApply}
                                    >
                                        <div className="space-y-2">
                                            <FormField 
                                                control={form.control}
                                                name="1"
                                                render={() =>(
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={question.placeholder}
                                                            className="min-h-[120px] resize-none transition-all"
                                                            onFocus={() => setActiveQuestion(index)}
                                                        />
                                                    </FormControl>
                                                )}
                                            />
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    );
                })}

                <div
                    className="flex justify-between items-center"
                    ref={formEndRef}
                >
                    <div className="text-sm">
                        {filledFields === questionnaire.length ? (
                            <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                All questions answered
                            </span>
                        ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {questionnaire.length - filledFields} questions
                                remaining
                            </span>
                        )}
                    </div>
                    <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Link href="/member/">Submit</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
