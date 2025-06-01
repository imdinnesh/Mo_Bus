import {RouteDetails} from "@/components/route-details";

interface PageProps {
  params: {
    routeId: string;
  };
}
export default async function RouteDetailsPage({ params }: PageProps) {

    return (
        <div>
            <h1>Route Details</h1>
            <p>This page will display details for a specific route.</p>
            <RouteDetails routeId={params.routeId} />
        </div>
    )
}