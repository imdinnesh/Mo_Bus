import BusCard from "@/components/BusCard";
import BusTicket from "@/components/BusTicket";
import NearbyBuses from "@/components/NearbyBuses";
import SearchBus from "@/components/Search";

export default function Home() {
  return (
    <div className="p-4">
      <SearchBus />
      <div className="flex flex-row gap-2">
        <BusTicket />
        <BusCard />
      </div>
        <NearbyBuses/>
    </div>
  );
}
