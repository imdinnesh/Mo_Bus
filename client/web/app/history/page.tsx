import { CalendarDays, MapPin, ArrowRight, IndianRupee, Clock } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cookies } from "next/headers";
import axios, { AxiosResponse } from "axios";

type Booking = {
    start_stop_id: number;
    start_stop_name: string;
    end_stop_id: number;
    end_stop_name: string;
    amount: number;
    booking_date: string;
};

type BookingResponse = {
    bookings: Booking[];
};

export default async function HistoryPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    let bookings: Booking[] = [];
    let error = null;

    try {
        const response: AxiosResponse<BookingResponse> = await axios.get("http://localhost:8080/dashboard/bookings", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token.value}` }),
            },
        });
        bookings = response.data.bookings;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            error = err.response.data.error || "Failed to load data";
        } else {
            error = "An error occurred while fetching data";
        }
        console.log(error);
    }

    // Calculate stats (if no error)
    const totalAmount = error ? null : bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const uniqueRoutes = error ? null : new Set(
        bookings.map((booking) => `${booking.start_stop_name} to ${booking.end_stop_name}`)
    ).size;
    const mostRecentBooking = error ? null : bookings.length > 0
        ? new Date(bookings[bookings.length - 1].booking_date)
        : null;

    // Format the date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (date.toString() === "Invalid Date" || date.getFullYear() <= 1) {
                return "Invalid date";
            }
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    // Group bookings by month (if no error)
    const bookingsByMonth: Record<string, Booking[]> = {};
    if (!error) {
        bookings.forEach((booking) => {
            const date = new Date(booking.booking_date);
            const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

            if (!bookingsByMonth[monthYear]) {
                bookingsByMonth[monthYear] = [];
            }
            bookingsByMonth[monthYear].push(booking);
        });
    }

    // Group bookings by route for summary (if no error)
    const routeCounts: Record<string, number> = {};
    const routeAmounts: Record<string, number> = {};
    if (!error) {
        bookings.forEach((booking) => {
            const route = `${booking.start_stop_name} to ${booking.end_stop_name}`;
            routeCounts[route] = (routeCounts[route] || 0) + 1;
            routeAmounts[route] = (routeAmounts[route] || 0) + booking.amount;
        });
    }

    // Sort routes by count (if no error)
    const popularRoutes = error ? [] : Object.entries(routeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Sort bookings by date (newest first) (if no error)
    const sortedBookings = error ? [] : [...bookings].sort((a, b) =>
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
    );

    // Calculate monthly spending (if no error)
    const monthlySpending = error ? [] : Object.entries(bookingsByMonth).map(([month, monthBookings]) => ({
        month,
        total: monthBookings.reduce((sum, booking) => sum + booking.amount, 0),
        count: monthBookings.length
    }));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
                <p className="text-muted-foreground">
                    View and manage your trip bookings and travel expenses
                </p>
                <Separator className="my-2" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-sm text-red-600">Unable to load data</div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">₹{totalAmount?.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Across {bookings.length} bookings
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Routes</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-sm text-red-600">Unable to load data</div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{uniqueRoutes}</div>
                                <p className="text-xs text-muted-foreground">
                                    Different destinations traveled
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Booking</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-sm text-red-600">Unable to load data</div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {mostRecentBooking ? formatDate(mostRecentBooking.toISOString()) : "N/A"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mostRecentBooking
                                        ? `${mostRecentBooking.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        : "No recent bookings"}
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Trip Cost</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-sm text-red-600">Unable to load data</div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    ₹{bookings.length ? (totalAmount! / bookings.length).toFixed(2) : "0.00"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Per booking average
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All Bookings</TabsTrigger>
                        <TabsTrigger value="routes">Popular Routes</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
                    </TabsList>
                </div>

                {/* All Bookings Tab */}
                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                            <CardDescription>All your trips ordered by most recent</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <div className="text-center text-red-600 py-6">Unable to load bookings</div>
                            ) : (
                                <ScrollArea className="h-[450px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Trip</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedBookings.length > 0 ? (
                                                sortedBookings.map((booking, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{booking.start_stop_name}</span>
                                                                    <span className="text-xs text-muted-foreground flex items-center">
                                                                        <ArrowRight className="h-3 w-3 mr-1" />
                                                                        {booking.end_stop_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{formatDate(booking.booking_date)}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(booking.booking_date).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">₹{booking.amount.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                        No bookings found
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={2}>Total</TableCell>
                                                <TableCell className="text-right">₹{totalAmount?.toFixed(2)}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Popular Routes Tab */}
                <TabsContent value="routes">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Routes</CardTitle>
                                <CardDescription>Your most frequently traveled routes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error ? (
                                    <div className="text-center text-red-600 py-6">Unable to load popular routes</div>
                                ) : (
                                    <div className="space-y-4">
                                        {popularRoutes.map(([route, count], index) => (
                                            <div key={route} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center">
                                                        {index + 1}
                                                    </Badge>
                                                    <div>
                                                        <div className="font-medium">{route}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {count} trip{count !== 1 ? "s" : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="font-medium">
                                                    ₹{routeAmounts[route].toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Route Tags</CardTitle>
                                <CardDescription>Quick view of your destinations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error ? (
                                    <div className="text-center text-red-600 py-6">Unable to load route tags</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(routeCounts)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([route, count]) => (
                                                <Badge key={route} variant="secondary" className="py-1">
                                                    {route} ({count})
                                                </Badge>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Monthly Summary Tab */}
                <TabsContent value="monthly">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Spending</CardTitle>
                            <CardDescription>Your travel expenses by month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <div className="text-center text-red-600 py-6">Unable to load monthly data</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead>Trips</TableHead>
                                            <TableHead className="text-right">Total Spent</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {monthlySpending.length > 0 ? (
                                            monthlySpending.map((item) => (
                                                <TableRow key={item.month}>
                                                    <TableCell className="font-medium">{item.month}</TableCell>
                                                    <TableCell>{item.count}</TableCell>
                                                    <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                    No monthly data available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}