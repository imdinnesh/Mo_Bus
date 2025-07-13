"use client";

import { generateQrode } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw } from "lucide-react";

// --- Apple Wallet Style Ticket Page ---
export default function TicketPageWalletStyle() {
    const [sessionKey, setSessionKey] = useState<string | null>(null);

    useEffect(() => {
        setSessionKey(localStorage.getItem("session_key"));
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["generateQrode", sessionKey],
        queryFn: () => generateQrode(sessionKey!),
        enabled: !!sessionKey,
        refetchInterval: 5000,
    });

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
                        Valid for one trip. Session: {sessionKey ? `...${sessionKey.slice(-6)}` : 'N/A'}
                    </p>
                </div>
                
                {/* Perforated Separator with Cutouts */}
                <div className="relative border-t-2 border-dashed border-zinc-700">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-zinc-800 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-zinc-800 rounded-full"></div>
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
                            className="w-96 h-64"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}