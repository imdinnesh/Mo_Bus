"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTripStore } from '@/store/useTripStore';
import { useStopName } from "@/hooks/useStops";

export default function TripPlannerPage() {
    const searchParams = useSearchParams();
    const destinationIdStore = useTripStore((state) => state.destinationId);

    // const destinationId= searchParams.get("destination");
    const { data: stopName, isLoading, error } = useStopName(destinationIdStore);


    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Trip Planner</h1>
            <p className="text-lg">
                Your current destination is:{" "}
                <span className="font-semibold">
                    {stopName || "Not set"}
                </span>
            </p>
        </div>
    );
}
