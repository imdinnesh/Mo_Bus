'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bus, Ticket, MapPin } from 'lucide-react';
import { useRouteDetail } from '@/hooks/useRouteDetail';
import { useRouter } from 'next/navigation';

export default function RouteDetailsPage() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get('routeId') || '';
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
  } = useRouteDetail(routeId);

  if (isLoading) return <RouteDetailsSkeleton />;
  if (error) return <p className="p-4 text-red-600">Error: {error.message}</p>;
  if (!data) return <p className="p-4">No route data found.</p>;

  const sortedStops =
    data.RouteStops?.slice().sort((a, b) => a.stop_index - b.stop_index) || [];


  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Bus className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Route Details</h1>
      </div>

      {/* Route Header Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {data.route_number}
                </CardTitle>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  AC
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{data.route_name}</p>
            </div>
            <Button className="gap-2"
            onClick={()=>router.push(`/select-trip?routeId=${data.id}`)}
            >
              <Ticket className="w-4 h-4" />
              Buy Ticket
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stop List Timeline */}
      <Card className="shadow-sm">
        <CardHeader>
          <h2 className="font-semibold text-lg text-gray-800">Route Stops</h2>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-[500px] overflow-y-auto pr-4">
            <div className="space-y-4">
              {sortedStops.map((stop) => (
                <div key={stop.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{stop.Stop.stop_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RouteDetailsSkeleton() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-8 w-48" />

      {/* Route Header Card Skeleton */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>

      {/* Stop List Timeline Skeleton */}
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-y-auto pr-4 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <Skeleton className="w-3 h-3 rounded-full mt-1.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}