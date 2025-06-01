"use client";
import { useStops } from '@/hooks/useStops';
import { useRoutes } from '@/hooks/useRoutes';

export default function TetsPage() {
    const { data: stops, isLoading: stopsLoading } = useStops();
    const { data: routes, isLoading: routesLoading } = useRoutes();

    if (stopsLoading || routesLoading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Stops</h2>
            <ul className="mb-4">
                {Object.entries(stops!).map(([id, name]) => (
                    <li key={id}>{name} (ID: {id})</li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mb-2">Routes</h2>
            <ul>
                {Object.entries(routes!).map(([id, number]) => (
                    <li key={id}>Route {number} (ID: {id})</li>
                ))}
            </ul>
        </div>
    );
}
