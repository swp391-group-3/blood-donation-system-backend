"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"

// Zod schema for form validation
const preDonationSchema = z.object({
  generalHealth: z.string().min(1, "Please provide information about your current health status"),
  donationHistory: z.string().min(1, "Please describe your blood donation history"),
  medications: z.string().min(1, "Please list any medications you are currently taking"),
  medicalConditions: z.string().min(1, "Please describe any chronic medical conditions you may have"),
  recentIllness: z.string().min(1, "Please describe any recent illnesses or symptoms"),
  travelHistory: z.string().min(1, "Please describe any recent travel outside the country"),
  lifestyleFactors: z.string().min(1, "Please describe your lifestyle including sleep, diet, and exercise"),
  allergiesAndReactions: z.string().min(1, "Please describe any allergies or adverse reactions you've experienced"),
  infectiousDiseases: z.string().min(1, "Please provide information about any history of infectious diseases"),
  additionalConcerns: z.string().min(1, "Please share any additional health concerns or information"),
  additionalInfo: z.string().optional(),
})

type PreDonationFormData = z.infer<typeof preDonationSchema>

// Streamlined questionnaire with 10 essential questions
const questionnaire = [
  {
    id: "generalHealth",
    question: "How are you feeling today? Describe your current health status.",
    category: "general",
    helpText:
      "Please describe how you're feeling today, including any symptoms, fatigue, or general wellness concerns.",
    placeholder:
      "I am feeling well today. I had a good night's sleep and feel energetic. No symptoms of illness or discomfort...",
  },
  {
    id: "donationHistory",
    question: "Tell us about your blood donation history and experience.",
    category: "donation_history",
    helpText: "Please describe when you last donated blood, how often you donate, and any experiences you've had.",
    placeholder:
      "I last donated blood 3 months ago at the local blood center. I have been donating regularly for 2 years with no complications...",
  },
  {
    id: "medications",
    question: "What medications, supplements, or vitamins are you currently taking?",
    category: "medical",
    helpText:
      "Please list all medications, supplements, and vitamins you are currently taking, including dosages and frequency.",
    placeholder:
      "I am currently taking a daily multivitamin, 81mg aspirin as prescribed by my doctor, and vitamin D supplements. No prescription medications...",
  },
  {
    id: "medicalConditions",
    question: "Do you have any chronic medical conditions or ongoing health issues?",
    category: "medical",
    helpText:
      "Please describe any ongoing medical conditions, even if they are well-controlled, including diabetes, heart conditions, etc.",
    placeholder:
      "I have well-controlled high blood pressure managed with medication. Blood pressure readings are consistently normal. No other chronic conditions...",
  },
  {
    id: "recentIllness",
    question: "Describe any recent illnesses, infections, or symptoms you've experienced in the past month.",
    category: "medical",
    helpText: "Please describe any cold, flu, fever, dental work, or other health issues in the past 4 weeks.",
    placeholder:
      "I had a mild cold 3 weeks ago with congestion and cough, but fully recovered. Had a routine dental cleaning 2 weeks ago. No fever or other symptoms since...",
  },
  {
    id: "travelHistory",
    question: "Describe any travel outside the country in the last 3 months.",
    category: "travel",
    helpText:
      "Please provide details about international travel, including destinations, dates, and any health precautions taken.",
    placeholder:
      "I traveled to Canada for vacation 6 weeks ago for one week. No travel to high-risk areas, tropical regions, or areas with disease outbreaks...",
  },
  {
    id: "lifestyleFactors",
    question: "Describe your lifestyle including sleep, diet, exercise, and substance use.",
    category: "lifestyle",
    helpText:
      "Please describe your sleep patterns, eating habits, exercise routine, alcohol consumption, and smoking habits.",
    placeholder:
      "I get 7-8 hours of sleep nightly, eat a balanced diet, exercise 3 times per week. I occasionally have wine with dinner, don't smoke or use drugs...",
  },
  {
    id: "allergiesAndReactions",
    question: "Describe any allergies or adverse reactions you've experienced.",
    category: "medical",
    helpText:
      "Please describe any known allergies to medications, foods, or other substances, and any adverse reactions to medical procedures.",
    placeholder:
      "I have a mild allergy to peanuts that causes hives. No known drug allergies or severe reactions to medical procedures...",
  },
  {
    id: "infectiousDiseases",
    question: "Please provide information about any history of infectious diseases or high-risk exposures.",
    category: "medical",
    helpText:
      "This information is confidential and helps ensure blood safety for recipients. Include any testing history.",
    placeholder:
      "I have never tested positive for HIV, Hepatitis B, or Hepatitis C. No history of tuberculosis, malaria, or other infectious diseases. Regular health screenings are normal...",
  },
  {
    id: "additionalConcerns",
    question: "Please share any additional health concerns, family history, or information you think is relevant.",
    category: "additional",
    helpText: "Include any family medical history, concerns about donation, or other relevant health information.",
    placeholder:
      "Family history includes diabetes in grandparents. I'm slightly nervous about needles but have donated before successfully. No other concerns or relevant information...",
  },
]

const mockRequest = {
  id: "1",
  title: "Emergency O- needed for surgery",
  bloodGroup: "O-",
  priority: "high",
  startDate: "2025-06-01",
  endDate: "2025-06-03",
  location: "Main Blood Center, 123 Medical Drive",
  description: "Urgent need for O- blood for emergency surgery patients. Your donation can save lives.",
  hospital: "City General Hospital",
  contactInfo: "+1 (555) 123-4567",
}

export default function PreDonationSurveyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  const formEndRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    getValues,
  } = useForm<PreDonationFormData>({
    resolver: zodResolver(preDonationSchema),
    defaultValues: {
      generalHealth: "",
      donationHistory: "",
      medications: "",
      medicalConditions: "",
      recentIllness: "",
      travelHistory: "",
      lifestyleFactors: "",
      allergiesAndReactions: "",
      infectiousDiseases: "",
      additionalConcerns: "",
      additionalInfo: "",
    },
    mode: "onChange",
  })

  const watchedFields = watch()

  // Calculate progress based on filled fields
  const filledFields = Object.values(watchedFields).filter(
    (value) => typeof value === "string" && value.trim().length > 0,
  ).length

  // Exclude additionalInfo from required fields count
  const progressPercentage = (filledFields / questionnaire.length) * 100

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({ type: null, message: "" })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const onSubmitQuestionnaire = (data: PreDonationFormData) => {
    console.log("Form data:", data)
    setStep(2)
    setNotification({
      type: "success",
      message: "Survey completed successfully! Please review your appointment details.",
    })

    // Scroll to top of confirmation section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmitApplication = async () => {
    if (!agreedToTerms) {
      setNotification({
        type: "error",
        message: "Please agree to the terms and conditions before confirming your appointment.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setNotification({
        type: "success",
        message: "Application submitted successfully! You will receive a confirmation email shortly.",
      })

      // Delay navigation to show success message
      setTimeout(() => {
        router.push(`/dashboard/appointments`)
      }, 1500)
    } catch (error) {
      setNotification({
        type: "error",
        message: "There was an error submitting your application. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  const getQuestionStatus = (questionId: string) => {
    const value = watchedFields[questionId as keyof PreDonationFormData]
    if (!value || value.length === 0) return "empty"
    return "complete"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Notification Banner */}
      {notification.type && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 animate-fade-in ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : notification.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && <CheckCircle className="h-5 w-5" />}
            {notification.type === "error" && <AlertTriangle className="h-5 w-5" />}
            {notification.type === "info" && <AlertCircle className="h-5 w-5" />}
            <p>{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotification({ type: null, message: "" })}
            className="h-8 w-8 p-0 rounded-full"
          >
            ×
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pre-Donation Health Survey</h1>
          <p className="text-gray-500">Complete the detailed health questionnaire for blood donation eligibility</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Survey Progress</span>
            <span className="text-sm text-gray-500">
              {filledFields} of {questionnaire.length} questions answered
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${step >= 1 ? "text-red-600" : "text-gray-400"}`}>Health Survey</span>
            <span className={`text-xs ${step >= 2 ? "text-red-600" : "text-gray-400"}`}>Confirmation</span>
          </div>
        </CardContent>
      </Card>

      {/* Request Summary */}
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
                <p className="text-sm font-medium">Blood Group</p>
                <p className="text-sm text-gray-600">{mockRequest.bloodGroup}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Donation Period</p>
                <p className="text-sm text-gray-600">
                  {new Date(mockRequest.startDate).toLocaleDateString()} -{" "}
                  {new Date(mockRequest.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Priority</p>
                <Badge className="bg-red-500">
                  {mockRequest.priority.charAt(0).toUpperCase() + mockRequest.priority.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Heart className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Hospital</p>
                <p className="text-sm text-gray-600">{mockRequest.hospital}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmitQuestionnaire)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Pre-Donation Health Survey
              </CardTitle>
              <CardDescription>
                Please provide answers to all 10 questions. This information helps ensure the safety of both donors and
                recipients.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Question Cards */}
          {questionnaire.map((question, index) => {
            const status = getQuestionStatus(question.id)

            return (
              <Card
                key={question.id}
                className={`border-l-4 transition-all duration-300 ${
                  status === "complete" ? "border-l-green-500" : "border-l-blue-200"
                } ${activeQuestion === index ? "ring-2 ring-blue-200" : ""}`}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        status === "complete" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                      <CardDescription className="mt-2">{question.helpText}</CardDescription>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {question.category.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  {status === "complete" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      {...register(question.id as keyof PreDonationFormData)}
                      placeholder={question.placeholder}
                      className={`min-h-[120px] resize-none transition-all ${
                        errors[question.id as keyof PreDonationFormData]
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : status === "complete"
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : ""
                      }`}
                      onFocus={() => setActiveQuestion(index)}
                    />
                    {errors[question.id as keyof PreDonationFormData] && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors[question.id as keyof PreDonationFormData]?.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-xs text-gray-500">
                    {watchedFields[question.id as keyof PreDonationFormData]?.length || 0} characters
                  </div>
                </CardFooter>
              </Card>
            )
          })}

          {/* Additional Information Card */}
          <Card className="border-l-4 border-l-green-200">
            <CardHeader>
              <CardTitle className="text-lg">Additional Information (Optional)</CardTitle>
              <CardDescription>
                Please provide any additional health information that might be relevant to your donation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register("additionalInfo")}
                placeholder="Any additional health information, allergies, concerns, or other relevant details..."
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center" ref={formEndRef}>
            <div className="text-sm">
              {filledFields === questionnaire.length ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  All questions answered
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {questionnaire.length - filledFields} questions remaining
                </span>
              )}
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={!isValid}>
              {isValid ? "Continue to Confirmation" : "Please answer all questions"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Survey Complete
              </CardTitle>
              <CardDescription className="text-green-700">
                Thank you for completing the health survey. Please review and confirm your appointment.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Confirmation</CardTitle>
              <CardDescription>Please review your appointment details before confirming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Donation Request</p>
                  <p className="text-sm text-gray-600">{mockRequest.title}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Blood Group</p>
                  <p className="text-sm text-gray-600">{mockRequest.bloodGroup}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{mockRequest.location}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Available Dates</p>
                  <p className="text-sm text-gray-600">
                    {new Date(mockRequest.startDate).toLocaleDateString()} -{" "}
                    {new Date(mockRequest.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What to expect:</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Health screening</p>
                      <p className="text-sm text-gray-600">Mini-physical examination and questionnaire review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Blood donation</p>
                      <p className="text-sm text-gray-600">Typically takes 8-10 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Recovery time</p>
                      <p className="text-sm text-gray-600">15-20 minutes with refreshments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Total time</p>
                      <p className="text-sm text-gray-600">Approximately 45-60 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Before your appointment:</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Eat a healthy meal and stay hydrated</li>
                      <li>• Get a good night's sleep</li>
                      <li>• Bring a valid ID</li>
                      <li>• Avoid alcohol for 24 hours before donation</li>
                      <li>• Wear comfortable clothing with sleeves that can be rolled up</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} className="mt-1" />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-red-600 hover:underline font-medium">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-red-600 hover:underline font-medium">
                    privacy policy
                  </a>
                  . I confirm that all information provided is accurate and I understand the donation process.
                </Label>
              </div>
              {!agreedToTerms && notification.type === "error" && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  You must agree to the terms and conditions
                </p>
              )}

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Survey
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  disabled={!agreedToTerms || isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm Appointment
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
