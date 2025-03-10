"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, X, MapPin, ArrowRight, Loader2 } from "lucide-react"
import { GenerateQrCode } from "./generate-qrcode"

interface PageProps {
    source?: string
    destination?: string
}

interface TicketInfo {
    ticketId: number
    source: string
    destination: string
    qrCodeGenerated: boolean
}

export const MakePayment = ({ source, destination }: PageProps) => {
    const [paymentDone, setPaymentDone] = useState(false)
    const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingTicket, setIsCheckingTicket] = useState(true)
    const router = useRouter()

    // Check for existing ticket on component mount
    useEffect(() => {
        const storedTicket = sessionStorage.getItem("currentTicket")

        if (storedTicket) {
            try {
                const parsedTicketInfo: TicketInfo = JSON.parse(storedTicket)
                setTicketInfo(parsedTicketInfo)
                setPaymentDone(true)
            } catch (error) {
                console.error("Error parsing stored ticket:", error)
                sessionStorage.removeItem("currentTicket")
            }
        }

        setIsCheckingTicket(false)
    }, [])

    const handlePayment = async () => {
        if (!source || !destination) {
            toast.error("Source and destination are required")
            return
        }

        setIsLoading(true)
        const data = {
            start_stop_id: source ? Number.parseInt(source, 10) : undefined,
            end_stop_id: destination ? Number.parseInt(destination, 10) : undefined,
        }

        const token = sessionStorage.getItem("token")

        try {
            const response = await axios.post("http://localhost:8080/bookings/", data, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })

            if (response.statusText === "OK") {
                const newTicketInfo: TicketInfo = {
                    ticketId: response.data.ticket_id,
                    source: source,
                    destination: destination,
                    qrCodeGenerated: false,
                }
                setTicketInfo(newTicketInfo)
                setPaymentDone(true)
                sessionStorage.setItem("currentTicket", JSON.stringify(newTicketInfo))
                toast.success(response.data.message || "Ticket booked successfully!")
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error
                toast.error(errorMessage)
            } else {
                toast.error("An error occurred while booking the ticket")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.push("/dashboard")
    }

    const handleClearTicket = () => {
        sessionStorage.removeItem("currentTicket")
        setPaymentDone(false)
        setTicketInfo(null)
        router.push("/dashboard")
    }

    const handleQrCodeGenerated = () => {
        if (ticketInfo) {
            const updatedTicketInfo = { ...ticketInfo, qrCodeGenerated: true }
            setTicketInfo(updatedTicketInfo)
            sessionStorage.setItem("currentTicket", JSON.stringify(updatedTicketInfo))
        }
    }

    const handleUseLater = () => {
        handleClearTicket() // This will clear the ticket and redirect to dashboard
    }

    if (isCheckingTicket) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardContent className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading ticket information...</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    {paymentDone ? "Ticket Confirmed" : "Confirm Your Ticket"}
                </CardTitle>
                <CardDescription>
                    {paymentDone
                        ? "Your ticket has been successfully booked"
                        : "Review your journey details and confirm your ticket"}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <MapPin className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">From</p>
                            <p className="font-medium">{ticketInfo?.source || source || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <MapPin className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">To</p>
                            <p className="font-medium">{ticketInfo?.destination || destination || "Not specified"}</p>
                        </div>
                    </div>
                </div>

                {ticketInfo && (
                    <>
                        <Separator className="my-6" />
                        <GenerateQrCode
                            ticket_id={ticketInfo.ticketId}
                            qrCodeGenerated={ticketInfo.qrCodeGenerated}
                            onQrCodeGenerated={handleQrCodeGenerated}
                            onUseLater={handleUseLater}
                        />
                    </>
                )}
            </CardContent>

            <CardFooter className="flex gap-2 justify-end bg-muted/20 p-4">
                {!paymentDone ? (
                    <>
                        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={handlePayment} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Confirm Ticket
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={handleClearTicket}>
                        Book Another Ticket
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

