"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function NearbyBuses() {

    const router = useRouter();

    return (
        <Button
            className="w-full lg:w-auto"
            size="lg"
            onClick={() => router.push('/nearby-buses')}
        >
            Nearby Buses
        </Button>
    )
}