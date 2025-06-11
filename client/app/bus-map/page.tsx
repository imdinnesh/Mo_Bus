"use client"
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the BusMap component
const DynamicBusMap = dynamic(() => import('@/components/bus-map'), {
    ssr: false, // This is crucial for Leaflet
    loading: () => (
        <div className="h-[600px] w-full">
            {/* You can use a shadcn Skeleton component for a nice loading state */}
            <Skeleton className="h-full w-full" />
        </div>
    ),
})

export default function BusTrackingPage() {
    const busToTrack = "bus-101";

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Bus Tracker</h1>

            {/* The dynamically loaded map will render here */}
            <DynamicBusMap busNumber={busToTrack} />

            {/* Other content on your page */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold">Details</h2>
                <p className="text-muted-foreground">
                    More information about the bus route can go here.
                </p>
            </div>
        </main>
    )
}