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

import { useQuery } from '@tanstack/react-query';
import { getRoutedetails } from '@/api/routes';

export const useRouteDetail = (routeId: string) => {
    return useQuery<RouteDetailsType, Error>({
        queryKey: ['routeDetails', routeId],
        queryFn: () => getRoutedetails(routeId),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!routeId,
    })
}

