import { ActiveTickets } from "@/components/active-tickets";
import { NearbyBuses } from "@/components/nearby-buses";
import { QuickActions } from "@/components/quick-actions";
import { SearchCard } from "@/components/search-card";
import { TicketActionCard } from "@/components/ticket-action-card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    // Use a more theme-friendly background
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Plan your trip or view your active tickets.
          </p>
        </header>

        <main className="space-y-8">
          {/* Top Section - Search & Active Tickets */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <SearchCard />
            </div>
            <div className="lg:col-span-2">
              <ActiveTickets />
            </div>
          </section>

          {/* Bottom Section - Quick Actions & Primary CTA */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>

            {/* The new, improved card takes its place */}
            <div>
              <TicketActionCard />
            </div>
          </section>
          <NearbyBuses />
        </main>
      </div>
    </div>
  );
}