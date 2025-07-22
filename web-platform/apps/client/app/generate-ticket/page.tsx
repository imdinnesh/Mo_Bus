"use client";

import { createTrip } from "@/api/bookings";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useBookingStore } from "@/store/useBookingStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ticket, Loader2, AlertTriangle } from "lucide-react";

export default function GenerateTicketPage() {
    const { routeId, startStopId, endStopId, bookingId } = useBookingStore();
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ["createTrip"],
        mutationFn: createTrip,
        onSuccess: (data) => {
            toast.success(data.message || "Trip started successfully!");
            localStorage.setItem("session_key", data.session_key);
            router.push("/ticket");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to start trip. Please try again.");
        },
    });

    const handleStartTrip = () => {
        mutation.mutate({
            booking_id: bookingId,
            route_id: routeId,
            source: startStopId,
            destination: endStopId,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/20 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Start Your Trip</CardTitle>
                        <Ticket className="w-6 h-6 text-primary" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>You're all set! Start your journey by activating the ticket below.</p>
                        <p className="text-xs">Please ensure you're at the boarding point before proceeding.</p>
                        <p className="text-sm font-medium text-foreground">
                            ⏳ Ticket validity: <span className="font-semibold text-primary">30 minutes</span> after activation.
                        </p>
                    </div>

                    <Button
                        className="w-full h-11 text-base font-medium"
                        disabled={mutation.isPending}
                        onClick={handleStartTrip}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Starting Trip...
                            </>
                        ) : (
                            <>
                                <Ticket className="w-4 h-4 mr-2" />
                                Start Trip
                            </>
                        )}
                    </Button>

                    {mutation.isError && (
                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Failed to start the trip. Please try again.</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
