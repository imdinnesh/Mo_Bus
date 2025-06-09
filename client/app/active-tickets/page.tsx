"use client"
import { getBookings } from "@/api/bookings"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isAfter, subDays } from "date-fns"
import { IndianRupee, MapPin, Calendar, Route, Clock, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Ticket = {
  id: number
  route_number: string
  route_name: string
  source_stop_name: string
  destination_stop_name: string
  booking_date: string
  amount: number
}

export default function ActiveTicketPage() {

  const router=useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["active-tickets"],
    queryFn: getBookings,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    retry: 1,
    staleTime: 10000,
  })

  const isTicketExpired = (bookingDate: string) => {
    const oneDayAgo = subDays(new Date(), 1)
    return !isAfter(new Date(bookingDate), oneDayAgo)
  }

  const handleUseTicket = (ticket: Ticket) => {
    localStorage.setItem("bookingId", ticket.id.toString())
    router.push('/redirect-page')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mx-auto" />
        </div>
        <Card>
          <CardContent className="p-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6 border-b last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center max-w-4xl">
        <Card className="max-w-md mx-auto p-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">No Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">You don't have any active tickets at the moment.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeTickets = data.filter((ticket: Ticket) => !isTicketExpired(ticket.booking_date))
  const expiredTickets = data.filter((ticket: Ticket) => isTicketExpired(ticket.booking_date))

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Your Tickets</h1>
        <p className="text-muted-foreground">
          {data.length} {data.length === 1 ? "ticket" : "tickets"} total
        </p>
      </div>

      {/* Active Tickets */}
      {activeTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-green-600" />
            Active Tickets ({activeTickets.length})
          </h2>
          <Card>
            <CardContent className="p-0">
              {activeTickets.map((ticket: Ticket, index: number) => (
                <div key={ticket.id}>
                  <div className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Route className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Route {ticket.route_number}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.route_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                          <IndianRupee className="h-5 w-5" />
                          {ticket.amount}
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                          <p className="font-medium">{ticket.source_stop_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                          <p className="font-medium">{ticket.destination_stop_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Booked on</p>
                          <p className="font-medium">{format(new Date(ticket.booking_date), "MMM dd, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(ticket.booking_date), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => handleUseTicket(ticket)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                        size="lg"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Use Now - Start Trip
                      </Button>
                    </div>
                  </div>
                  {index < activeTickets.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expired Tickets */}
      {expiredTickets.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-muted-foreground" />
            Expired Tickets ({expiredTickets.length})
          </h2>
          <Card className="opacity-75">
            <CardContent className="p-0">
              {expiredTickets.map((ticket: Ticket, index: number) => (
                <div key={ticket.id}>
                  <div className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-lg">
                          <Route className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-muted-foreground">Route {ticket.route_number}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.route_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-semibold text-muted-foreground">
                          <IndianRupee className="h-5 w-5" />
                          {ticket.amount}
                        </div>
                        <Badge variant="destructive">Expired</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                          <p className="font-medium text-muted-foreground">{ticket.source_stop_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                          <p className="font-medium text-muted-foreground">{ticket.destination_stop_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Booked on</p>
                          <p className="font-medium text-muted-foreground">
                            {format(new Date(ticket.booking_date), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(ticket.booking_date), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < expiredTickets.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
