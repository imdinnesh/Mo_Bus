"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
export function QuickActions() {
    const router = useRouter();
    const actions = [
        {
            title: "One-way Ticket",
            description: "Book a single journey ticket.",
            onClick: () => router.push("/select-trip"),
        },
        {
            title: "Bus Pass",
            description: "Purchase or renew your bus pass.",
            onClick: () => router.push("/bus-pass"),
        },
        {
            title: "View Balance",
            description: "Check your card balance and transaction history.",
            onClick: () => router.push("/user-details"),
        },
        {
            title: "Recharge Card",
            description: "Top up your bus card.",
            onClick: () => router.push("/recharge-card"), // Assuming a new route for recharge
        },
    ];
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                    Perform common actions quickly and easily.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="flex h-auto flex-col items-start p-4 text-left"
                        onClick={action.onClick}
                    >
                        <span className="text-md font-semibold">
                            {action.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {action.description}
                        </span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}