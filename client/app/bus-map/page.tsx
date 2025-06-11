"use client"
import dynamic from "next/dynamic"

const BusMap = dynamic(() => import("@/components/bus-map"), { ssr: false })

export default function BusMapPage() {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold mb-4">Live Bus Tracker</h1>
            <BusMap />
        </main>
    )
}