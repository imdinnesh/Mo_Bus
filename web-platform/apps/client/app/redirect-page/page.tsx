"use client"

import { getBookingById } from "@/api/bookings"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, IndianRupee, Bus, ArrowRight, Ticket, Home } from "lucide-react"

export default function RedirectPage() {
    const [bookingId, setBookingId] = useState<string | null>(null)
    const router = useRouter()

    // Access localStorage only after the component mounts
    useEffect(() => {
        const storedId = localStorage.getItem("bookingId")
        if (storedId) {
            setBookingId(storedId)
        }
    }, [])

    const { data, isLoading } = useQuery({
        queryKey: ["bookingDetails", bookingId],
        queryFn: () => getBookingById(bookingId!),
        enabled: !!bookingId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
    })

    const handleStartTrip = () => {
        router.push("/generate-ticket")
    }

    const handleGoHome = () => {
        router.push("/dashboard")
    }

    if (!bookingId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                <Ticket className="w-6 h-6 text-destructive" />
                            </div>
                            <h3 className="font-semibold text-lg">Booking Not Found</h3>
                            <p className="text-muted-foreground">No booking ID found. Please try booking again.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Bus className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Loading Booking</h3>
                                <p className="text-muted-foreground">Fetching your booking details...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                <Ticket className="w-6 h-6 text-destructive" />
                            </div>
                            <h3 className="font-semibold text-lg">Booking Not Found</h3>
                            <p className="text-muted-foreground">No booking found for ID: {bookingId}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="min-h-screen  dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-6">
                {/* Success Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Ticket className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h1>
                    <p className="text-muted-foreground">Your bus ticket has been successfully booked</p>
                </div>

                {/* Booking Details Card */}
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Booking Details</CardTitle>
                            <Badge variant="secondary" className="font-mono">
                                #{data.id}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Route Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Bus className="w-4 h-4 text-primary" />
                                <span className="font-medium">Route {data.route_number}</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">{data.route_name}</p>
                        </div>

                        <Separator />

                        {/* Journey Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">{data.source_stop_name}</p>
                                        <p className="text-xs text-muted-foreground">From</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-medium text-right">{data.destination_stop_name}</p>
                                        <p className="text-xs text-muted-foreground text-right">To</p>
                                    </div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Booking Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Booked on</p>
                                    <p className="text-sm font-medium">{formatDate(data.booking_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Amount</p>
                                    <p className="text-sm font-medium">₹{data.amount}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button onClick={handleStartTrip} className="w-full h-12 text-base font-medium" size="lg">
                        <Ticket className="w-4 h-4 mr-2" />
                        Use Ticket Now
                    </Button>
                    <Button variant="outline" onClick={handleGoHome} className="w-full h-12 text-base" size="lg">
                        <Home className="w-4 h-4 mr-2" />
                        Save for Later
                    </Button>
                </div>

                {/* Helper Text */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">You can access your ticket anytime from the dashboard</p>
                </div>
            </div>
        </div>
    )
}
