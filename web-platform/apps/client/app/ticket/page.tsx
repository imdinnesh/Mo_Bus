"use client";

import { generateQrode } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, TicketX } from "lucide-react";

// --- Apple Wallet Style Ticket Page ---
export default function TicketPageWalletStyle() {
    const [sessionKey, setSessionKey] = useState<string | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        const key = localStorage.getItem("session_key");
        setSessionKey(key);
        setIsCheckingSession(false);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["generateQrode", sessionKey],
        queryFn: () => generateQrode(sessionKey!),
        enabled: !!sessionKey,
        refetchInterval: 5000,
    });

    // While checking localStorage, show a generic loader
    if (isCheckingSession) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-200">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
            </div>
        );
    }

    // If no session key was found, display a "No Ticket Found" message
    if (!sessionKey) {
        return (
            // The page background now adapts to the theme
            <div className="flex justify-center items-center min-h-screen bg-zinc-200 dark:bg-zinc-900 p-4 transition-colors duration-300">
                {/* 
              The card styles are updated with `dark:` prefixes.
              - In light mode: bg-white, text-zinc-800
              - In dark mode: bg-black, text-zinc-100, with a subtle ring for definition
            */}
                <div className="relative w-full max-w-xs bg-white dark:bg-black text-zinc-800 dark:text-zinc-100 rounded-2xl shadow-2xl dark:ring-1 dark:ring-white/20 overflow-hidden">
                    <div className="p-8 text-center flex flex-col items-center gap-4">
                        <TicketX className="w-12 h-12 text-red-500" />
                        <h2 className="text-xl font-bold">No Ticket Found</h2>
                        {/* The paragraph text color also adapts for better readability */}
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            No active session was found. Please purchase a ticket first.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If a session key exists, render the ticket
    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-200 p-4">
            <div className="relative w-full max-w-xs bg-black text-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Main Ticket Body */}
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase text-zinc-400">Transit Pass</p>
                            <h2 className="text-2xl font-bold">City Bus</h2>
                        </div>
                        <RefreshCw className="w-5 h-5 text-zinc-400 animate-spin [animation-duration:5s]" />
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">
                        Valid for one trip. Session: {`...${sessionKey.slice(-6)}`}
                    </p>
                </div>

                {/* Perforated Separator with Cutouts */}
                <div className="relative border-t-2 border-dashed border-zinc-700">
                    {/* The cutout effect requires the background color of the parent container */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-zinc-200 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-zinc-200 rounded-full"></div>
                </div>

                {/* QR Code Section */}
                <div className="p-6 flex justify-center items-center bg-white">
                    {isLoading || !data ? (
                        <div className="w-48 h-48 flex flex-col justify-center items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                            <p className="text-xs text-zinc-500 mt-2">Loading Code...</p>
                        </div>
                    ) : (
                        <img
                            src={data.qr_code}
                            alt="Ticket QR Code"
                            className="w-48 h-48" // Corrected to be square for proper QR code display
                        />
                    )}
                </div>
            </div>
        </div>
    );
}