import { ActiveTickets } from "@/components/active-tickets"
import { QuickActions } from "@/components/quick-actions"
import { SearchCard } from "@/components/search-card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <SearchCard />
        <ActiveTickets />
        <QuickActions />
      </div>
    </div>
  )
}
