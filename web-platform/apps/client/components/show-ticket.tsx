"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShowTicketButton() {
    const router = useRouter();

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
        >
            <Button
                size="lg"
                className={cn(
                    "group w-full h-16 text-lg font-bold tracking-wide",
                    // A gradient from dark gray to pure black adds depth
                    "bg-gradient-to-br from-zinc-900 to-black",
                    "text-white",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300 ease-in-out"
                )}
                onClick={() => router.push("/ticket")}
            >
                <Ticket className="mr-3 h-6 w-6 transform transition-transform group-hover:rotate-12" />
                Show Ticket
            </Button>
        </motion.div>
    );
}