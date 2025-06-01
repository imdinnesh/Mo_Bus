'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRoutedetails } from '@/api/routes';

interface RouteStop {
    id: number;
    route_id: number;
    stop_id: number;
    stop_index: number;
    Stop: {
        id: number;
        stop_name: string;
    };
}

interface RouteDetailsType {
    id: number;
    route_number: string;
    route_name: string;
    direction: number;
    RouteStops: RouteStop[];
}

interface Props {
    routeId: string;
}

function RouteDetailsDisplay({ data }: { data: RouteDetailsType }) {
    // Sort stops by stop_index ascending
    const sortedStops = data.RouteStops?.slice().sort((a, b) => a.stop_index - b.stop_index) || [];

    return (
        <div>
            <h2>Route Number: {data.route_number}</h2>
            <h3>Route Name: {data.route_name}</h3>

            <h4>Stops:</h4>
            <ol>
                {sortedStops.map((routeStop) => (
                    <li key={routeStop.id}>{routeStop.Stop.stop_name}</li>
                ))}
            </ol>
        </div>
    );
}

export function RouteDetails({ routeId }: Props) {
    const { data, isLoading, error } = useQuery<RouteDetailsType, Error>({
        queryKey: ['routeDetails', routeId],
        queryFn: () => getRoutedetails(routeId),
        refetchOnWindowFocus: false,
        retry: 1, // Retry once on failure
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
        enabled: !!routeId, // Only run the query if routeId is provided
    }
    );

    if (isLoading) return <p>Loading route details...</p>;
    if (error) return <p>Error loading route details: {error.message}</p>;
    if (!data) return <p>No route data found.</p>;

    return <RouteDetailsDisplay data={data} />;
}
