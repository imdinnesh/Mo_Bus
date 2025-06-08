'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStopNameById, useStops } from '@/hooks/useStops';
import { useTripStore } from '@/store/useTripStore';
import { useTripQuerySync } from '@/hooks/useTripQuerySync';


export default function TripPlannerPage() {
  useTripQuerySync();

  const {
    routeId, sourceId, destinationId,
    routeNumber, sourceLabel, destinationLabel,
    setRoute, setSource, setDestination,
    reset,
  } = useTripStore();

  const { data: stops, isLoading } = useStops();
  const destinationName = stops ? getStopNameById(stops, destinationId) : null;


  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Trip Planner Page</h1>
      <p>Destination ID: {destinationId}</p>
      <p>Destination Name: {destinationName || 'Unknown Stop'}</p>
    </div>
  );
}
