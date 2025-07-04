// src/components/ticket-action-card.tsx
"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TicketActionCard() {
    const router = useRouter();

    return (
        // The main container:
        // - Set to the required h-72.
        // - Changed to flex-col for a vertical layout.
        // - justify-center and items-center to center the content.
        // - text-center to align all text.
        <div className={cn(
            "flex h-72 w-full flex-col items-center justify-center text-center",
            "p-6 bg-gradient-to-br from-zinc-900 to-black rounded-xl text-white shadow-2xl"
        )}>

            {/* Icon: Made larger and given space */}
            <div className="mb-4 bg-white/10 p-4 rounded-full">
                <Ticket className="w-10 h-10 text-white" />
            </div>

            {/* Text Content: Scaled up for better visibility */}
            <h2 className="text-2xl font-bold">
                Active Ticket
            </h2>
            <p className="text-zinc-400 mt-1">
                Ready for your trip.
            </p>

            {/* Button Section: Spaced out and enlarged */}
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full max-w-xs mt-8" // Added top margin and max-width
            >
                <Button
                    size="lg" // Reverted to large size for a primary button
                    className={cn(
                        "group w-full h-14 text-lg font-bold tracking-wide", // Larger font and height
                        "bg-white text-black", // High-contrast style
                        "hover:bg-zinc-200",
                        "shadow-lg hover:shadow-xl transition-all"
                    )}
                    onClick={() => router.push("/ticket")}
                >
                    Show Ticket
                    {/* Icon is now always visible and larger */}
                    <Ticket className="ml-3 h-6 w-6 transform transition-transform group-hover:rotate-12" />
                </Button>
            </motion.div>
        </div>
    );
}