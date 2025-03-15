"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Clock, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface QRCodeResponse {
  qrcode: string // Base64 encoded QR code
  start_stop: string // Name of the start stop
  end_stop: string // Name of the end stop
  created_at: string // Timestamp in the format "YYYY-MM-DD HH:mm:ss.SSSSSS +TZ"
  expiry_time: string // Timestamp in the format "YYYY-MM-DD HH:mm:ss.SSSSSS +TZ"
}

interface QRCodeListResponse {
  qrcodes: QRCodeResponse[] // Array of QR code responses
}

export default function QrCodes() {
  const [data, setData] = useState<QRCodeListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        setLoading(true)
        // Get token from cookies on client side
        const response = await axios.get<QRCodeListResponse>("http://localhost:8080/qrcode/list", {
          withCredentials: true,
        })

        if (response.statusText === "OK") {
          setData(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching QR Codes")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQRCodes()
  }, [])

  // Replace the isExpired function with this improved version that handles timezones better
  const isExpired = (expiryTimeStr: string | null | undefined): boolean => {
    if (!expiryTimeStr) return true // If no expiry time, consider it expired

    try {
      // Parse the date string, handling the timezone properly
      const expiryTime = new Date(expiryTimeStr.replace(" IST", ""))
      return isNaN(expiryTime.getTime()) || expiryTime <= new Date()
    } catch (e) {
      console.error("Error parsing date:", e)
      return true // If date parsing fails, consider it expired
    }
  }

  // Helper function to safely format dates
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Unknown"

    try {
      const date = new Date(dateStr)
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
    } catch (e) {
      return "Invalid date"
    }
  }

  // Add this new component for the countdown timer
  const CountdownTimer = ({ expiryTime }: { expiryTime: string }) => {
    const [timeLeft, setTimeLeft] = useState<string>("Calculating...")

    useEffect(() => {
      if (!expiryTime) return

      const calculateTimeLeft = () => {
        try {
          const expiry = new Date(expiryTime.replace(" IST", ""))
          const now = new Date()

          if (isNaN(expiry.getTime()) || expiry <= now) {
            setTimeLeft("Expired")
            return
          }

          const diffMs = expiry.getTime() - now.getTime()
          const minutes = Math.floor(diffMs / 60000)
          const seconds = Math.floor((diffMs % 60000) / 1000)

          setTimeLeft(`${minutes}m ${seconds}s`)
        } catch (e) {
          setTimeLeft("Invalid date")
        }
      }

      calculateTimeLeft()
      const timer = setInterval(calculateTimeLeft, 1000)

      return () => clearInterval(timer)
    }, [expiryTime])

    return <span>{timeLeft}</span>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Tickets</h1>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Skeleton className="h-[150px] w-[150px] rounded-lg" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && data && (
        <>
          {data.qrcodes && data.qrcodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.qrcodes.map((ticket, index) => {
                const expired = isExpired(ticket?.expiry_time)

                return (
                  <Card key={index} className={`hover:shadow-lg transition-shadow ${expired ? "opacity-75" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {ticket?.start_stop || "Unknown"} to {ticket?.end_stop || "Unknown"}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Created: {formatDate(ticket?.created_at)}
                          </CardDescription>
                        </div>
                        <Badge variant={expired ? "destructive" : "default"}>{expired ? "Expired" : "Active"}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                      {ticket?.qrcode ? (
                        <div className="flex justify-center p-2 bg-white rounded-lg">
                          <Image
                            src={`data:image/png;base64,${ticket.qrcode}`}
                            alt="QR Code Ticket"
                            width={150}
                            height={150}
                            className={`rounded-lg ${expired ? "grayscale" : ""}`}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-[150px] w-[150px] bg-gray-100 rounded-lg">
                          <p className="text-gray-500">QR Code not available</p>
                        </div>
                      )}

                      {/* Replace the expiry time display in the card with this */}
                      <div className="w-full text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span
                          className={`${isExpired(ticket?.expiry_time) ? "text-red-500" : "text-green-500 font-medium"}`}
                        >
                          {isExpired(ticket?.expiry_time) ? "Expired on: " : "Time remaining: "}
                          {isExpired(ticket?.expiry_time) ? (
                            formatDate(ticket?.expiry_time)
                          ) : (
                            <CountdownTimer expiryTime={ticket?.expiry_time || ""} />
                          )}
                        </span>
                      </div>

                      <div className="w-full text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>
                          {ticket?.start_stop || "Unknown"} → {ticket?.end_stop || "Unknown"}
                        </span>
                      </div>

                      <Button variant={expired ? "outline" : "default"} className="w-full" disabled={expired}>
                        {expired ? "Ticket Expired" : "View Details"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You don't have any tickets yet</p>
              <Button>Purchase a Ticket</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

