"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { QrCode, Clock, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface GenerateQrCodeProps {
    ticket_id: number
    qrCodeGenerated: boolean
    onQrCodeGenerated: () => void
    onUseLater: () => void
}

export const GenerateQrCode = ({ ticket_id, qrCodeGenerated, onQrCodeGenerated, onUseLater }: GenerateQrCodeProps) => {
    const [qrCode, setQrCode] = useState<string | null>(null)
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
                { ticket_id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                },
            )

            if (response.statusText === "OK") {
                setQrCode(response.data.qr_code)
                onQrCodeGenerated()
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

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Ticket #{ticket_id}</h3>

            {!qrCodeGenerated ? (
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1" onClick={handleGenerateQrCode} disabled={isLoading}>
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

                    <Button variant="outline" className="flex-1" onClick={onUseLater}>
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
                </div>
            ) : (
                <p className="text-center text-muted-foreground">
                    QR code has been generated. Please check your tickets in the dashboard.
                </p>
            )}
        </div>
    )
}

