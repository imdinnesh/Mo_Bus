import { ActiveTickets } from "@/components/active-tickets";
import { NearbyBuses } from "@/components/nearby-buses";
import { QuickActions } from "@/components/quick-actions";
import { SearchCard } from "@/components/search-card";
import { TicketActionCard } from "@/components/ticket-action-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Plan your trip or view your active tickets.
          </p>
        </header>

        <main className="space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <SearchCard />
            </div>
            <div className="lg:col-span-2">
              <ActiveTickets />
            </div>
          </section>

          {/* === CORRECTED SECTION === */}
          {/* We change to a 4-column grid and place each item directly in it */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* QuickActions now takes 2 of the 4 columns on large screens */}
            <div className="md:col-span-2 lg:col-span-2">
              <QuickActions />
            </div>

            {/* TicketActionCard and NearbyBuses each take 1 column */}
            <div>
              <TicketActionCard />
            </div>
            <div>
              <NearbyBuses />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}