"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
    PlusCircle,
    PenSquare,
    Route,
    MapPin,
    Network,
    type LucideIcon,
} from "lucide-react";

// Define the type for our actions for better type-safety
type ActionItem = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

// Store actions in a data structure for scalability
const actions: ActionItem[] = [
    {
        title: "Add Stops",
        description: "Create and place new transit stops on the map.",
        href: "/add-stops",
        icon: MapPin,
    },
    {
        title: "Update Stops",
        description: "Modify details or locations of existing stops.",
        href: "/update-stops",
        icon: PenSquare,
    },
    {
        title: "Add Routes",
        description: "Design and save new transit routes.",
        href: "/add-routes",
        icon: Route,
    },
    {
        title: "Update Routes",
        description: "Edit paths and schedules of existing routes.",
        href: "/update-routes",
        icon: PenSquare, // Using PenSquare again for consistency
    },
    {
        title: "Manage Route Stops",
        description: "Assign or reorder stops for a specific route.",
        href: "/routestops",
        icon: Network,
    },
    // {
    //     title: "Add Another Action",
    //     description: "It's easy to add more actions here.",
    //     href: "/another-action",
    //     icon: PlusCircle,
    // },
];

export function QuickActions() {
    const router = useRouter();

    return (
        <div className="bg-background p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Transit Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Quickly access key administrative tasks below.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {actions.map((action) => (
                        <Card
                            key={action.href}
                            className="flex flex-col transition-all hover:shadow-lg"
                        >
                            <CardHeader>
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <action.icon className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-center text-xl">{action.title}</CardTitle>
                                <CardDescription className="pt-2 text-center">
                                    {action.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto flex">
                                <Button
                                    onClick={() => router.push(action.href)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Open
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}