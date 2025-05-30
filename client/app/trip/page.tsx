import { TripForm } from "@/components/trip-form";

interface PageProps {
  searchParams: OptionalTripSearchParams;
}

export default function TripPage({ searchParams }: PageProps) {
  const { start, end, route } = searchParams;

  return (
    <div>
      <TripForm start={start} end={end} route={route} />
    </div>
  );
}
