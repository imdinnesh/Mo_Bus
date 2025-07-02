// hooks/use-nearby-buses.ts
import { useQuery } from '@tanstack/react-query';
import { getNearByBuses } from '@/api/bus';

// Define the type for a single bus in the list
export type NearbyBus = {
  busId: string;
  distance: number;
  latitude: number;
  longitude: number;
  routeId: string;
  timestamp: string;
};

export const useNearbyBuses = (lat?: number, lon?: number) => {
  return useQuery<NearbyBus[], Error>({
    queryKey: ['nearbyBuses', lat, lon],
    queryFn: () => getNearByBuses(lat!, lon!),
    // Only run the query if lat and lon are available
    enabled: !!lat && !!lon,
    refetchOnWindowFocus: true, // Good for live data
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Data is stale after 15 seconds
  });
};