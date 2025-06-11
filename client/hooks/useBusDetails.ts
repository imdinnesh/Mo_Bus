import { useQuery } from '@tanstack/react-query';
import { getBusByRouteId } from '@/api/bus';

interface Bus{
    id:number,
    bus_number: string;
    license_plate: string;
}

interface BusDetails {
    status: string;
    message: string;
    buses: Bus[];
}

export const useBusDetails = (routeId: string) => {
    return useQuery<BusDetails, Error>({
        queryKey: ['busDetails', routeId],
        queryFn: () => getBusByRouteId(routeId),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!routeId,
    });
};