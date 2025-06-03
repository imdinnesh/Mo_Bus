'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStopNameById, useStops } from '@/hooks/useStops';
import { useTripStore } from '@/store/useTripStore';


export default function TripPlannerPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('destination');

  const { setDestination, destinationId: storeDestinationId } = useTripStore();

  const { data: stops, isLoading } = useStops();
  const destinationName = stops ? getStopNameById(stops, destinationId) : null;

  // Update Zustand store if not already set
  useEffect(() => {
    if (destinationId && storeDestinationId !== destinationId && stops) {
      const stopName = getStopNameById(stops, destinationId) || 'Unknown Stop';
      setDestination(destinationId, stopName);
    }
  }, [destinationId, storeDestinationId, setDestination, stops]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Trip Planner Page</h1>
      <p>Destination ID: {destinationId}</p>
      <p>Destination Name: {destinationName || 'Unknown Stop'}</p>
    </div>
  );
}
