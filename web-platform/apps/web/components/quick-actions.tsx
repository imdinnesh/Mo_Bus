"use client";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export function QuickActions() {
    const router = useRouter();

    return (
        <div>
            <Button
            onClick={()=> router.push("/stops")}
            >
                Add Stops
            </Button>
        </div>
    )
}