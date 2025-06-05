"use client";

import { createTrip } from "@/api/bookings";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/useBookingStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GenerateTicketPage() {

    const { routeId, startStopId, endStopId, bookingId } = useBookingStore()
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ['createTrip'],
        mutationFn: createTrip,
        onSuccess: (data) => {
            console.log("Trip started successfully", data);
            toast.success(data.message || "Trip started successfully!");
            localStorage.setItem("session_key", data.session_key);
            router.push("/ticket");
            
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to start trip. Please try again.");
        }
    })

    const handleStartTrip = () => {
        mutation.mutate({
            booking_id: bookingId,
            route_id: routeId,
            source: startStopId,
            destination: endStopId
        })

    }


    return (
        <div>
            <Button
                onClick={handleStartTrip}
                disabled={mutation.isPending}
            >Start Trip</Button>
        </div>
    )
}