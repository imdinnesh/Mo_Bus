"use client";
import { useSearchParams } from "next/navigation";
import { RouteDetails } from "@/components/route-details";

export default function RouteDetailsPage() {

  const searchParams = useSearchParams();
  const routeId = searchParams.get("routeId") || "";
  console.log(routeId)


  return (
    <div>
      <h1>Route Details</h1>
      <p>This page will display details for a specific route.</p>
      <RouteDetails routeId={routeId} />
    </div>
  )
}