"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent,
    CardFooter
} from "./ui/card";
import { MapPin } from "lucide-react";

export function NearbyBuses() {
    const router = useRouter();

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Find Nearby Buses</CardTitle>
                <CardDescription>
                    See live bus locations and ETAs around you.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                {/* Visual element to make the card more engaging */}
                <div className="bg-primary/10 p-6 rounded-full">
                    <MapPin className="h-12 w-12 text-primary" />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push('/nearby-buses')}
                >
                    Show Map
                </Button>
            </CardFooter>
        </Card>
    )
}