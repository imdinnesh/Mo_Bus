'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTripStore } from '@/store/useTripStore';

export const useTripQuerySync = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        routeId, sourceId, destinationId,
        setRoute, setSource, setDestination,
    } = useTripStore();

    const queryRoute = searchParams.get('routeId');
    const querySource = searchParams.get('sourceId');
    const queryDest = searchParams.get('destId');

    // Step 1: URL → Zustand (first load only)
    useEffect(() => {
        if (queryRoute && queryRoute !== routeId) setRoute(queryRoute, '');
        if (querySource && querySource !== sourceId) setSource(querySource, '');
        if (queryDest && queryDest !== destinationId) setDestination(queryDest, '');
    }, []);

    // Step 2: Zustand → URL (sync when Zustand changes)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (routeId) params.set('routeId', routeId);
        if (sourceId) params.set('sourceId', sourceId);
        if (destinationId) params.set('destId', destinationId);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [routeId, sourceId, destinationId]);
};
