"use client";

import { createBookings } from "@/api/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStopNameById, useStops } from "@/hooks/useStops";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
export default function SelectTicketPage() {

    const searchParams = useSearchParams();
    const routeId = searchParams.get("routeId");
    const startStopId = searchParams.get("startStopId");
    const endStopId = searchParams.get("endStopId");
    const { data: stops, isLoading } = useStops();
    const startStopName = stops ? getStopNameById(stops, startStopId) : null;
    const endStopName = stops ? getStopNameById(stops, endStopId) : null;

    const [quantity, setQuantity] = useState(1);

    const mutation=useMutation({
        mutationKey: ['createBooking'],
        mutationFn:createBookings,
        onSuccess:(data)=>{
            console.log("Booking created successfully", data);
        },
        onError:(error:any)=>{
            console.error("Error creating booking", error);
        }

    })

    const createBooking=async()=>{
        mutation.mutate({
            route_id:routeId|| "",
            source_stop_id: startStopId || "",
            destination_stop_id: endStopId || "",
        })
    }

    return (
        <div>
            <div>
                <h1>Trip Details</h1>
                <p>Route ID: {routeId}</p>
                <p>{startStopName}</p>
                <p>{endStopName}</p>
            </div>
            <div>
                <Label htmlFor="quantity">Number of Tickets</Label>
                <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    readOnly
                />
                <Button onClick={() => setQuantity(quantity + 1)} >+</Button>
            </div>
            <div>
                Total Price: ₹ {quantity * 10}
            </div>
            <Button 
            onClick={createBooking}
            disabled={isLoading || !routeId || !startStopId || !endStopId}>
                {isLoading ? "Loading..." : "Book Ticket"}
            </Button>
        </div>
    )
}