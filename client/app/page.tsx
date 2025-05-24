import BusTicket from "@/components/BusTicket";
import SearchBus from "@/components/Search";

export default function Home() {
  return (
    <div className="p-4">
      <SearchBus/>
      <BusTicket/>
    </div>
  );
}
