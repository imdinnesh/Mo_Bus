"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card"
import { Ticket } from "lucide-react"
import { useState } from "react"

export function ActiveTickets() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
        setIsLoading(true)
        router.push("/active-tickets")
    }

    return (
        <Card className="w-full transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-lg font-medium">
                    <Ticket className="h-5 w-5 text-primary" />
                    Your Tickets
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <Button
                    onClick={handleClick}
                    className="w-full max-w-xs px-6 py-4 text-base font-semibold"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "View Active Tickets"}
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                    {isLoading ? "Fetching your tickets..." : "See your current journeys"}
                </p>
            </CardContent>
        </Card>
    )
}