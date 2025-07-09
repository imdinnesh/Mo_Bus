"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { format, isBefore, subDays } from "date-fns"
import { getBookings } from "@/api/bookings"

import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ScrollArea } from "@workspace/ui/components/scroll-area" // Import ScrollArea
import { IndianRupee, MapPin, Calendar, Route, Clock, Play, BarChart2, Star, Hash } from "lucide-react"

type Ticket = {
  id: number
  route_number: string
  route_name: string
  source_stop_name: string
  destination_stop_name: string
  booking_date: string
  amount: number
}

// --- Reusable Components for a Cleaner Structure ---

function StatCard({ icon: Icon, title, value, description }: { icon: React.ElementType; title: string; value: string | number; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function TicketStats({ tickets }: { tickets: Ticket[] }) {
  const stats = useMemo(() => {
    if (!tickets || tickets.length === 0) {
      return { totalSpent: 0, frequentRoute: "N/A" }
    }

    const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.amount, 0)

    const routeCounts = tickets.reduce((acc, ticket) => {
      const routeKey = `Route ${ticket.route_number}`
      acc[routeKey] = (acc[routeKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const frequentRoute = Object.keys(routeCounts).reduce(
      (a, b) => ((routeCounts[a] ?? 0) > (routeCounts[b] ?? 0) ? a : b),
      "N/A"
    )

    return { totalSpent, frequentRoute }
  }, [tickets])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
        <BarChart2 className="h-6 w-6" />
        Your Stats
      </h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <StatCard icon={Hash} title="Total Trips" value={tickets.length} description="All-time booked tickets" />
        <StatCard icon={IndianRupee} title="Total Spent" value={`₹${stats.totalSpent.toFixed(2)}`} description="Total amount for all tickets" />
      </div>
      <StatCard icon={Star} title="Most Frequent Route" value={stats.frequentRoute} description="Your most traveled route" />
    </div>
  )
}

function TicketCard({ ticket, isActive }: { ticket: Ticket; isActive: boolean }) {
  const router = useRouter()
  const handleUseTicket = () => {
    localStorage.setItem("bookingId", ticket.id.toString())
    router.push('/redirect-page') // Or wherever the QR code is shown
  }

  return (
    <div className={`rounded-lg border bg-card p-6 text-card-foreground transition-opacity ${!isActive && "opacity-60"}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg border bg-muted p-2">
            <Route className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Route {ticket.route_number}</h3>
            <p className="text-sm text-muted-foreground">{ticket.route_name}</p>
          </div>
        </div>
        <div className="flex sm:flex-col items-end justify-between sm:justify-start shrink-0">
          <div className="flex items-center gap-1 text-xl font-bold">
            <IndianRupee className="h-5 w-5" />
            {ticket.amount}
          </div>
          <Badge variant={isActive ? "outline" : "destructive"}>
            {isActive ? "Active" : "Expired"}
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">FROM</p>
            <p className="font-medium">{ticket.source_stop_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">TO</p>
            <p className="font-medium">{ticket.destination_stop_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 col-span-full">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">BOOKED ON</p>
            <p className="font-medium">
              {format(new Date(ticket.booking_date), "MMM dd, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>

      {isActive && (
        <Button onClick={handleUseTicket} className="w-full font-semibold" size="lg">
          <Play className="mr-2 h-4 w-4" />
          Use Ticket
        </Button>
      )}
    </div>
  )
}

function TicketPageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl p-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-64" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function ActiveTicketPage() {
  const { data: allTickets, isLoading, error } = useQuery({
    queryKey: ["all-user-tickets"],
    queryFn: getBookings,
    staleTime: 5 * 60 * 1000,
  })

  const { activeTickets, expiredTickets } = useMemo(() => {
    if (!allTickets) return { activeTickets: [], expiredTickets: [] }

    const oneDayAgo = subDays(new Date(), 1)
    const active = allTickets.filter((ticket: Ticket) => !isBefore(new Date(ticket.booking_date), oneDayAgo))
    const expired = allTickets.filter((ticket: Ticket) => isBefore(new Date(ticket.booking_date), oneDayAgo))

    return { activeTickets: active, expiredTickets: expired }
  }, [allTickets])

  if (isLoading) {
    return <TicketPageSkeleton />
  }

  if (error || !allTickets || allTickets.length === 0) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No Tickets Found</h2>
          <p className="mt-2 text-muted-foreground">It looks like you haven't booked any trips yet.</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/trip-planner")}>Plan a Trip</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl p-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Tickets</h1>
        <p className="text-muted-foreground">Manage your active tickets and view past trips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
        {/* Left Column: Ticket List */}
        <div className="md:col-span-2">
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                <Clock className="mr-2 h-4 w-4" /> Active ({activeTickets.length})
              </TabsTrigger>
              <TabsTrigger value="expired">Expired ({expiredTickets.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              <ScrollArea className="h-[500px] w-full">
                <div className="space-y-4 pr-4">
                  {activeTickets.length > 0 ? (
                    activeTickets.map((ticket:any) => <TicketCard key={ticket.id} ticket={ticket} isActive />)
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="py-12 text-center text-muted-foreground">No active tickets.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="expired" className="mt-6">
              <ScrollArea className="h-[500px] w-full">
                <div className="space-y-4 pr-4">
                  {expiredTickets.length > 0 ? (
                    expiredTickets.map((ticket:any) => <TicketCard key={ticket.id} ticket={ticket} isActive={false} />)
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="py-12 text-center text-muted-foreground">No expired tickets yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Statistics */}
        <div className="order-first md:order-last">
          <TicketStats tickets={allTickets} />
        </div>
      </div>
    </main>
  )
}