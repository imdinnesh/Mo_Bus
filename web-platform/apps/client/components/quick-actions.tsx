"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { ArrowRight, Ticket, CreditCard, Wallet, PlusCircle } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "One-way Ticket",
      description: "Single journey",
      onClick: () => router.push("/select-trip"),
      icon: <Ticket className="h-4 w-4 text-primary" />,
    },
    {
      title: "Bus Pass",
      description: "Purchase or renew",
      onClick: () => router.push("/bus-pass"),
      icon: <CreditCard className="h-4 w-4 text-primary" />,
    },
    {
      title: "View Balance",
      description: "Balance & history",
      onClick: () => router.push("/user-details"),
      icon: <Wallet className="h-4 w-4 text-primary" />,
    },
    {
      title: "Recharge Card",
      description: "Top up your card",
      onClick: () => router.push("/recharge-card"),
      icon: <PlusCircle className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-[1.1rem] font-semibold">Quick Actions</CardTitle>
        <CardDescription className="text-sm">
          Perform frequent tasks faster
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="group h-auto flex-col items-start p-3 text-left transition-all hover:bg-primary/5 hover:shadow-sm"
            onClick={action.onClick}
          >
            <div className="flex w-full items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 group-hover:bg-primary/20">
                {action.icon}
              </div>
              <div className="flex-1">
                <span className="block text-base font-medium">{action.title}</span>
                <span className="block text-sm text-muted-foreground">{action.description}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
