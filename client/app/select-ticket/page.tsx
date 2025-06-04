"use client"

import { createBookings } from "@/api/bookings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStopNameById, useStops } from "@/hooks/useStops"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { MapPin, Minus, Plus, ArrowRight, Ticket } from "lucide-react"
import { RedirectModal } from "@/components/redirect-modal"
import { Skeleton } from "@/components/ui/skeleton"

export default function SelectTicketPage() {
    const searchParams = useSearchParams()
    const routeId = searchParams.get("routeId")
    const startStopId = searchParams.get("startStopId")
    const endStopId = searchParams.get("endStopId")
    const { data: stops, isLoading: stopsLoading } = useStops()
    const startStopName = stops ? getStopNameById(stops, startStopId) : null
    const endStopName = stops ? getStopNameById(stops, endStopId) : null

    const [quantity, setQuantity] = useState(1)
    const [redirectModalOpen, setRedirectModalOpen] = useState(false)
    const ticketPrice = 10

    const mutation = useMutation({
        mutationKey: ["createBooking"],
        mutationFn: createBookings,
        onSuccess: (data) => {
            toast.success(data.message || "Booking created successfully", {
                description: `Your ${quantity} ticket(s) have been booked.`,
                action: {
                    label: "View Ticket",
                    onClick: () => setRedirectModalOpen(true)
                }
            })
            setRedirectModalOpen(true)
        },
        onError: (error: any) => {
            console.error("Error creating booking", error)
            toast.error("Failed to create booking", {
                description: error.message || "Please try again later."
            })
        },
    })

    const createBooking = async () => {
        if (!routeId || !startStopId || !endStopId) {
            toast.error("Missing information", {
                description: "Please ensure you've selected all required trip details."
            })
            return
        }

        const payload = {
            route_id: Number.parseInt(routeId),
            source_stop_id: Number.parseInt(startStopId),
            destination_stop_id: Number.parseInt(endStopId),
            quantity
        }

        mutation.mutate(payload)
    }

    const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10))
    const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1))

    if (stopsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-6 w-48 mx-auto" />

                    <Card className="shadow-lg">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-md">
                        <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Book Your Ticket</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Review your trip details and select the number of tickets
                    </p>
                </div>

                {/* Trip Details Card */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span>Trip Details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">{startStopName || "Unknown stop"}</p>
                                    <p className="text-sm text-gray-500">Departure</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="font-medium text-gray-900 text-right">{endStopName || "Unknown stop"}</p>
                                    <p className="text-sm text-gray-500 text-right">Destination</p>
                                </div>
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Route ID:</span>
                            <Badge variant="secondary" className="font-mono">
                                {routeId || "N/A"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Selection Card */}
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Ticket Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="quantity" className="text-base font-medium">
                                Number of Tickets
                            </Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="h-10 w-10 rounded-full"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = Math.min(Math.max(parseInt(e.target.value) || 1, 10))
                                        setQuantity(value)
                                    }}
                                    className="w-20 text-center text-lg font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={incrementQuantity}
                                    disabled={quantity >= 10}
                                    className="h-10 w-10 rounded-full"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-blue-50/50 p-4 rounded-lg space-y-2 border border-blue-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Price per ticket:</span>
                                <span className="font-medium">₹{ticketPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Quantity:</span>
                                <span className="font-medium">{quantity}</span>
                            </div>
                            <hr className="border-blue-200 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-blue-900">Total Amount:</span>
                                <span className="text-xl font-bold text-blue-900">
                                    ₹{(quantity * ticketPrice).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={createBooking}
                            disabled={mutation.isPending || stopsLoading || !routeId || !startStopId || !endStopId}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                            size="lg"
                        >
                            {mutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : (
                                `Book ${quantity} Ticket${quantity > 1 ? 's' : ''}`
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <RedirectModal
                    isOpen={redirectModalOpen}
                    onClose={() => setRedirectModalOpen(false)}
                />
            </div>
        </div>
    )
}