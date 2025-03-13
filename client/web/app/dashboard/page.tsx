import axios from "axios";
import { cookies } from "next/headers";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, History, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutUser } from "@/components/logout-user";

type Ticket = {
    id: number;
    created_at: string; // Can be converted to Date if needed
    booking_id: number;
    start_stop_name: string;
    end_stop_name: string;
};

type TicketResponse = {
    tickets: Ticket[];
};

export default async function Dashboard() {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    let data = null;
    let error = null;
    let loading = true;

    let loading2 = true;
    let error2 = null;
    let data2 = null;

    try {
        const request = await axios.get("http://localhost:8080/user/profile", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token.value}` }),
            },
        });

        if (request.statusText === "OK") {
            data = request.data;
            loading = false;
        }
    } catch (err) {
        loading = false;
        if (axios.isAxiosError(err) && err.response) {
            error = err.response.data.error || "Failed to load profile";
        } else {
            error = "An error occurred while fetching user profile";
        }
        console.log(error);
    }

    try {
        const request = await axios.get("http://localhost:8080/dashboard/tickets", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token.value}` }),
            },
        });

        if (request.statusText === "OK") {
            data2 = request.data as TicketResponse;
            loading2 = false;
            
        }
    } catch (err) {
        loading2 = false;
        if (axios.isAxiosError(err) && err.response) {
            error2 = err.response.data.error || "Failed to load tickets";
        } else {
            error2 = "An error occurred while fetching user tickets";
        }
        console.log(error2);
    }

    return (
        <div className="min-h-svh w-full bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <LogoutUser />
                </div>

                {/* Search Section */}
                <section className="bg-card rounded-xl p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Find Routes & Stops</h2>
                    <SearchBar />
                </section>

                {/* Balance Card */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <div className="text-destructive text-sm">
                                    Unable to load balance
                                </div>
                            ) : (
                                <div className="text-4xl font-bold tracking-tight">
                                    {" "}
                                    ₹{data?.balance?.toFixed(2) || "0.00"}
                                </div>
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

                    {/* Recent Activity Card */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>
                                Your recent ticket purchases and trips
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading2 ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-6">
                                    {error2 ? (
                                        <div className="text-destructive text-sm">{error2}</div>
                                    ) : data2?.tickets?.length === 0 ? (
                                        <div className="text-sm">No New Purchase</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr>
                                                        <th className="font-normal">Date</th>
                                                        <th className="font-normal">From</th>
                                                        <th className="font-normal">To</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data2?.tickets?.map((ticket: Ticket) => (
                                                        <tr key={ticket.id}>
                                                            <td>
                                                                {new Date(
                                                                    ticket.created_at
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td>{ticket.start_stop_name}</td>
                                                            <td>{ticket.end_stop_name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Link href="/bookings">
                        <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
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
                                <p className="text-sm text-muted-foreground mt-1">
                                    Purchase tickets for your journey
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/schedules">
                        <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
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
                                <p className="text-sm text-muted-foreground mt-1">
                                    View route timetables and schedules
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/profile">
                        <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
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
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <h3 className="font-medium">Profile</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Manage your account settings
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </section>
            </div>
        </div>
    );
}
