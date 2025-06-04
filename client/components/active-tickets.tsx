"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export function ActiveTickets() {

    const router=useRouter()

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Button onClick={()=> router.push("/active-tickets")} >
                Show Active Tickets
            </Button>
        </div>
    )
}