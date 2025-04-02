"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface QrCodeGeneratorProps {
    ticket_id: number
}

export const QrCodeGenerator = ({ ticket_id}: QrCodeGeneratorProps) => {
    const router = useRouter()
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [qrCodeGenerated, setQrCodeGenerated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerateQrCode = async () => {
        if (qrCodeGenerated) {
            toast.error("QR code has already been generated for this ticket.")
            return
        }

        setIsLoading(true)
        const token = sessionStorage.getItem("token")

        try {
            const response = await axios.post(
                "http://localhost:8080/qrcode/generate",
                {
                    ticket_id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                },
            )

            if (response.statusText === "OK") {
                setQrCode(response.data.qr_code)
                setQrCodeGenerated(true)
                toast.success(response.data.message || "QR code generated successfully")
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error
                toast.error(errorMessage)
            } else {
                toast.error("An error occurred while generating QR code")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleUseLater = () => {
        toast.info("You can use this ticket later from your dashboard")
        router.push("/dashboard/tickets")
    }

    const handleBackToDashboard = () => {
        router.push("/dashboard")
    }

    return (
        <div className="space-y-4">
            {!qrCodeGenerated ? (
                <div className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleGenerateQrCode} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <QrCode className="mr-2 h-4 w-4" />
                                Use Ticket Now
                            </>
                        )}
                    </Button>

                    <Button variant="outline" className="w-full" onClick={handleUseLater}>
                        <Clock className="mr-2 h-4 w-4" />
                        Use Later
                    </Button>
                </div>
            ) : qrCode ? (
                <div className="space-y-4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0 flex justify-center">
                            <div className="p-4 bg-white">
                                <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="max-w-full h-auto" />
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-center text-sm text-muted-foreground">
                        Please show this QR code to the conductor when boarding
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleBackToDashboard}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>
            ) : (
                <p className="text-center text-muted-foreground">
                    QR code has been generated. Please check your tickets in the dashboard.
                </p>
            )}
        </div>
    )
}

