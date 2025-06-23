"use client";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export function QuickActions() {
    const router = useRouter();

    return (
        <div>
            <Button
            onClick={()=> router.push("/add-stops")}
            >
                Add Stops
            </Button>
            <Button
            onClick={()=> router.push("/update-stops")}
            >
                Update Stops
            </Button>
            <Button
            onClick={()=> router.push("/add-routes")}
            >
                Add Routes
            </Button>
            <Button
            onClick={()=> router.push("/update-routes")}
            >
                Update Routes
            </Button>
        </div>
    )
}