"use client";

import Link from "next/link";
import { NearbyBus } from "@/hooks/use-nearby-buses";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Bus, Route, Clock } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { formatDistanceToNow } from "@/utils/distance.utils";

interface BusInfoCardProps extends React.ComponentProps<typeof Card> {
  bus: NearbyBus;
  isActive: boolean;
}

export function BusInfoCard({ bus, isActive, ...props }: BusInfoCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary",
        isActive && "border-primary ring-2 ring-primary/80"
      )}
      {...props}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow">
            <p className="flex items-center gap-2 font-bold text-lg">
              <Bus className="h-5 w-5 text-primary" />
              {bus.busId}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Route className="h-4 w-4" />
              Route {bus.routeId}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-lg">{bus.distance.toFixed(2)} km</p>
            <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(bus.timestamp))}
            </p>
          </div>
        </div>
        <Link href={`/route-details?routeId=${bus.routeId}`} passHref>
          <Button variant="link" className="p-0 h-auto mt-2 text-sm">
            View Route Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}