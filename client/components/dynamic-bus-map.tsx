"use client"
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"


const DynamicBusMap = dynamic(() => import('@/components/bus-map'), {
    ssr: false, // Leaflet is client-side only
    loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default DynamicBusMap;