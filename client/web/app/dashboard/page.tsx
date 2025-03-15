import axios from "axios"
import { cookies } from "next/headers"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, CreditCard, History, ArrowRight, Ticket, Clock, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { LogoutUser } from "@/components/logout-user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface TicketType {
  ticket_id: number
  start_stop: string
  end_stop: string
}

interface TicketsResponse {
  tickets: TicketType[]
}

export default async function Dashboard() {
  // Get the token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  let data = null
  let error = null
  let loading = true

  let loading2 = true
  let error2 = null
  let data2 = null

  try {
    const request = await axios.get("http://localhost:8080/user/profile", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token.value}` }),
      },
    })

    if (request.statusText === "OK") {
      data = request.data
      loading = false
    }
  } catch (err) {
    loading = false
    if (axios.isAxiosError(err) && err.response) {
      error = err.response.data.error || "Failed to load profile"
    } else {
      error = "An error occurred while fetching user profile"
    }
    console.log(error)
  }

  try {
    const request = await axios.get("http://localhost:8080/dashboard/tickets", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token.value}` }),
      },
    })

    if (request.statusText === "OK") {
      data2 = request.data as TicketsResponse
      loading2 = false
    }
  } catch (err) {
    loading2 = false
    if (axios.isAxiosError(err) && err.response) {
      error2 = err.response.data.error || "Failed to load tickets"
    } else {
      error2 = "An error occurred while fetching user tickets"
    }
    console.log(error2)
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <LogoutUser />
        </div>

        {/* Search Section */}
        <section className="bg-card rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Find Routes & Stops</h2>
          <SearchBar />
        </section>

        {/* Main Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <Card className="md:col-span-1 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Your Balance
              </CardTitle>
              <CardDescription>Available for ticket purchases</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {loading ? (
                <Skeleton className="h-12 w-32" />
              ) : error ? (
                <div className="text-destructive text-sm">Unable to load balance</div>
              ) : (
                <div className="text-4xl font-bold tracking-tight"> ₹{data?.balance?.toFixed(2) || "0.00"}</div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/recharge" className="w-full">
                <Button className="w-full gap-2" size="sm">
                  <CreditCard className="h-4 w-4" />
                  Recharge Balance
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* QR Code Card - Enhanced */}
          <Card className="md:col-span-1 shadow-sm hover:shadow-md transition-shadow border-primary/20">
            <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Active Tickets
              </CardTitle>
              <CardDescription>Your valid QR code tickets</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-2 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-2">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                <Clock className="h-3 w-3 mr-1" /> Valid Now
              </Badge>
              <p className="text-center text-sm text-muted-foreground">
                Access your active tickets with QR codes for quick scanning
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/qrcodes" className="w-full">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90" size="sm">
                  <Ticket className="h-4 w-4" />
                  View Your Tickets
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Recent Activity Card */}
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent ticket purchases and trips</CardDescription>
            </CardHeader>
            <CardContent>
              {loading2 ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="text-muted-foreground">
                  {error2 ? (
                    <div className="text-destructive text-sm">{error2}</div>
                  ) : data2?.tickets?.length === 0 ? (
                    <div className="text-sm text-center py-6">No New Purchase</div>
                  ) : (
                    <ScrollArea className="h-[200px] rounded-md border">
                      <table className="w-full text-left">
                        <thead className="sticky top-0 bg-card">
                          <tr>
                            <th className="px-6 py-3 font-medium text-gray-600">Date</th>
                            <th className="px-6 py-3 font-medium text-gray-600">From</th>
                            <th className="px-6 py-3 font-medium text-gray-600">To</th>
                            <th className="px-6 py-3 font-medium text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data2?.tickets?.map((ticket: TicketType) => (
                            <tr key={ticket.ticket_id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">{new Date().toLocaleDateString()}</td>
                              <td className="px-6 py-4">{ticket.start_stop}</td>
                              <td className="px-6 py-4">{ticket.end_stop}</td>
                              <td className="px-6 py-4">
                                <Link
                                  href={`/generate?id=${ticket.ticket_id}&from=${ticket.start_stop}&to=${ticket.end_stop}`}
                                >
                                  <span className="text-primary hover:text-primary-dark cursor-pointer font-medium">
                                    Generate Ticket
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/history" className="w-full">
                <Button variant="outline" className="w-full" size="sm">
                  View All Activity
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/bookings">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M8 6v12"></path>
                      <path d="M2 12h12"></path>
                      <path d="M18 6v12"></path>
                      <path d="M22 12h-4"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">Book Tickets</h3>
                  <p className="text-sm text-muted-foreground mt-1">Purchase tickets for your journey</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/schedules">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-medium">Schedules</h3>
                  <p className="text-sm text-muted-foreground mt-1">View route timetables and schedules</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

