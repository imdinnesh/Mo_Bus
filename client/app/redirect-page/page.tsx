"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function RedirectPage() {

    const router = useRouter()

    const handleStartTrip = () => {
        router.push("/generate-ticket")
    }

    const handleGoHome = () => {
        router.push("/dashboard")
    }


    return (
        <div>
            <div className="flex">
                <Button
                    onClick={handleStartTrip}
                >
                    Use Ticket Now
                </Button>
                <Button
                    onClick={handleGoHome}
                >
                    Use Later
                </Button>
            </div>
        </div>
    )
}