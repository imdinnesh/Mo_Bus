'use client';

import { useSearchParams } from 'next/navigation';
import { getStopNameById, useStops } from '@/hooks/useStops';

export default function TripPlannerPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('destination');
  
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
