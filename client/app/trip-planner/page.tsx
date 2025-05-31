"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTripStore } from '@/store/useTripStore';

export default function TripPlannerPage() {
    const destination = useTripStore((state) => state.destination);
    const setDestination = useTripStore((state) => state.setDestination);
    const searchParams = useSearchParams();

    useEffect(() => {
        const param = searchParams.get("destination");
        if (param && destination !== param) {
            setDestination(param);
        }
    }, [searchParams, destination, setDestination]);

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Trip Planner</h1>
            <p className="text-lg">Your current destination is: <span className="font-semibold">{destination || "Not set"}</span></p>
        </div>
    );
}
