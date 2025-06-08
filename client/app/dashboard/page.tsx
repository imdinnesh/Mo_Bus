import { ActiveTickets } from "@/components/active-tickets"
import { QuickActions } from "@/components/quick-actions"
import { SearchCard } from "@/components/search-card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section - Search */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <SearchCard />
          </div>
          <div className="lg:col-span-2">
            <ActiveTickets />
          </div>
        </div>

        {/* Bottom Section - Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          {/* Optional: Add another component here if needed */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <p className="text-muted-foreground">Your recent trips or other stats could go here</p>
          </div>
        </div>
      </div>
    </div>
  )
}