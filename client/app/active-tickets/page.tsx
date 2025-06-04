"use client";
import { getBookings } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isAfter, subDays } from "date-fns";
import { IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Ticket = {
  id: number;
  route_number: string;
  route_name: string;
  source_stop_name: string;
  destination_stop_name: string;
  booking_date: string;
  amount: number;
};

export default function ActiveTicketPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["active-tickets"],
    queryFn: getBookings,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    retry: 1,
    staleTime: 10000,
  });

  const isTicketExpired = (bookingDate: string) => {
    const oneDayAgo = subDays(new Date(), 1);
    return !isAfter(new Date(bookingDate), oneDayAgo);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle>No Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have any active tickets at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Tickets</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((ticket: Ticket) => {
          const expired = isTicketExpired(ticket.booking_date);
          return (
            <Card 
              key={ticket.id} 
              className={`hover:shadow-lg transition-shadow relative ${
                expired ? "opacity-75 border-destructive/20" : ""
              }`}
            >
              {expired && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">Expired</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Route {ticket.route_number}</span>
                  <span className={`flex items-center ${
                    expired ? "text-muted-foreground" : "text-primary"
                  }`}>
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {ticket.amount}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className={expired ? "text-muted-foreground" : ""}>
                      {ticket.route_name}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className={expired ? "text-muted-foreground" : ""}>
                        {ticket.source_stop_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className={expired ? "text-muted-foreground" : ""}>
                        {ticket.destination_stop_name}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Booked on</p>
                    <p className={expired ? "text-muted-foreground" : ""}>
                      {format(new Date(ticket.booking_date), "PPpp")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}