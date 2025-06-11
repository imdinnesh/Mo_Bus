"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { MapPin, Minus, Plus, Ticket, Loader2 } from "lucide-react"

import { createBookings } from "@/api/bookings"
import { getStopNameById, useStops } from "@/hooks/useStops"
import { useBookingStore } from "@/store/useBookingStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

// --- Skeleton Component for the new Two-Column Layout ---
function SelectTicketSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl p-4 py-8 md:py-12">
            {/* Header Skeleton */}
            <div className="mb-12 flex flex-col items-center space-y-3 text-center">
                <Skeleton className="h-9 w-80" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Two-Column Grid Skeleton */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-12">
                {/* Left Column Skeleton */}
                <div className="md:col-span-3">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-6 w-32" />
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column Skeleton */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-7 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// --- Main Page Component ---
export default function SelectTicketPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const routeId = searchParams.get("routeId")
    const startStopId = searchParams.get("startStopId")
    const endStopId = searchParams.get("endStopId")

    const { data: stops, isLoading: stopsLoading } = useStops()
    const startStopName = stops ? getStopNameById(stops, startStopId) : null
    const endStopName = stops ? getStopNameById(stops, endStopId) : null
    
    const [quantity, setQuantity] = useState(1)
    const ticketPrice = 10 // Assuming a fixed price

    const setBooking = useBookingStore(state => state.setBooking)

    const mutation = useMutation({
        mutationKey: ["createBooking"],
        mutationFn: createBookings,
        onSuccess: (data) => {
            toast.success(data.message || "Booking created successfully.")
            setBooking(data.booking_id, parseInt(routeId!), parseInt(startStopId!), parseInt(endStopId!))
            localStorage.setItem("bookingId", data.booking_id.toString())
            router.push("/redirect-page")
        },
        onError: (error: any) => {
            console.error("Error creating booking", error)
            toast.error("Failed to create booking.", {
                description: error.message || "An unexpected error occurred. Please try again."
            })
        },
    })

    const handleCreateBooking = () => {
        if (!routeId || !startStopId || !endStopId) {
            toast.error("Missing trip information.", {
                description: "Please go back and select a complete trip."
            })
            return
        }

        mutation.mutate({
            route_id: Number.parseInt(routeId),
            source_stop_id: Number.parseInt(startStopId),
            destination_stop_id: Number.parseInt(endStopId),
        })
    }

    const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10))
    const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1))

    if (stopsLoading) {
        return <SelectTicketSkeleton />
    }

    return (
        <main className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto max-w-6xl p-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-12 flex flex-col items-center space-y-2 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Confirm Your Trip</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Review your journey details below. On the right, select the number of tickets you need and proceed to payment.
                    </p>
                </div>
                
                {/* Two-Column Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-12">
                    {/* Left Column: Trip Details */}
                    <div className="md:col-span-3">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Ticket className="h-5 w-5" />
                                    Your Itinerary
                                </CardTitle>
                                <CardDescription>
                                    This is a summary of your selected trip.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Visual Timeline */}
                                <div className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="h-full w-px border-l-2 border-dashed" />
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Departure</p>
                                            <p className="font-bold text-lg">{startStopName || "Unknown Stop"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Destination</p>
                                            <p className="font-bold text-lg">{endStopName || "Unknown Stop"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
                                    <span>Route ID</span>
                                    <Badge variant="outline" className="font-mono">{routeId || "N/A"}</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Ticket Selection (Sticky) */}
                    <div className="md:col-span-2">
                        <div className="sticky top-8 space-y-6">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Select Tickets</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label htmlFor="quantity" className="text-sm font-medium text-muted-foreground">
                                            Quantity
                                        </Label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="h-14 w-14 rounded-md" aria-label="Decrease quantity">
                                                <Minus className="h-5 w-5" />
                                            </Button>
                                            <Input id="quantity" type="text" readOnly value={quantity} className="h-14 w-24 rounded-md text-center text-2xl font-bold [appearance:textfield]" />
                                            <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= 10} className="h-14 w-14 rounded-md" aria-label="Increase quantity">
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-muted-foreground">Ticket Price</span>
                                            <span className="font-medium">₹{ticketPrice.toFixed(2)} x {quantity}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-bold tracking-tight">
                                                ₹{(quantity * ticketPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                     <Button onClick={handleCreateBooking} disabled={mutation.isPending || !routeId} className="h-12 w-full text-lg" size="lg">
                                        {mutation.isPending ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
                                        ) : (
                                            `Proceed to Pay`
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}