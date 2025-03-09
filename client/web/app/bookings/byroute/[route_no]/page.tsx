import { cookies } from "next/headers"
import axios, { type AxiosError } from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight, MapPin } from "lucide-react"
import { Suspense } from "react"
import Link from "next/link"

interface Params {
    route_no: string
}

type Stop = {
    stop_id: number
    stop_name: string
}

type RouteResult = {
    message: string
    route_stops: Stop[]
}

// Loading component for Suspense
function StopsLoading() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="w-full">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Error component
function ErrorDisplay({ message }: { message: string }) {
    return (
        <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
            <AlertDescription className="mt-1">{message}</AlertDescription>
        </Alert>
    )
}

// Stops list component
async function StopsList({ route_no }: { route_no: string }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const requestBody = {
        route_number: route_no,
    }

    try {
        const response = await axios.post("http://localhost:8080/search/", requestBody, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })

        const result: RouteResult = response.data

        if (!result.route_stops || result.route_stops.length === 0) {
            return <ErrorDisplay message="No stops found for this route" />
        }

        return (
            <div className="space-y-4">
                {result.route_stops.map((stop) => (
                    <div
                        key={stop.stop_id}
                        className="flex items-center gap-4 p-5 border rounded-lg hover:bg-muted/50 transition-colors shadow-sm"
                    >
                        <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-lg">{stop.stop_name}</p>
                            <p className="text-sm text-muted-foreground">Stop ID: {stop.stop_id}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    } catch (error) {
        const axiosError = error as AxiosError
        let errorMessage = "Failed to load route stops"

        if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = `Server error: ${axiosError.response.status}`
            if (axiosError.response.data && typeof axiosError.response.data === "object") {
                const data = axiosError.response.data as any
                if (data.message) errorMessage = data.message
            }
        } else if (axiosError.request) {
            // The request was made but no response was received
            errorMessage = "No response from server. Please check your connection."
        }

        return <ErrorDisplay message={errorMessage} />
    }
}

export default async function ShowStops({ params }: { params: Params }) {
    const paras= await params
    const route_no = paras.route_no

    return (
        <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <div className="max-w-4xl w-full mx-auto">
                <Card className="shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-3xl font-bold">Route {route_no}</CardTitle>
                        <div className="flex flex-row gap-2 justify-between items-center">

                        <CardDescription className="text-base mt-2">
                            List of all stops for route number {route_no}

                        </CardDescription>
                        <Link href={`/ticket/byroute/`}>
                            <Button variant="outline" className="flex items-center gap-2 mt-4">
                                Book Tickets
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-6">
                        <Suspense fallback={<StopsLoading />}>
                            <StopsList route_no={route_no} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}