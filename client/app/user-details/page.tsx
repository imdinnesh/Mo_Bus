"use client"

import { useQuery } from "@tanstack/react-query"
import { getBalance, getTransactions } from "@/api/transactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react"


interface Transaction {
    id: number;
    amount: number;
    status: string;
    created_at: string;
    type: "credit" | "debit";
}

// --- Skeleton Component for a polished loading state ---
function UserDetailsSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl p-4 py-8 md:py-12">
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Balance Card Skeleton */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-48" />
                    </CardContent>
                </Card>

                {/* Transactions Card Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- Reusable Component for a single transaction item ---
function TransactionItem({ transaction }: { transaction: Transaction }) {
    const isCredit = transaction.type === 'credit';

    const title = isCredit ? "Balance Updated" : "Ticket Booked";
    const Icon = isCredit ? ArrowUpCircle : ArrowDownCircle;
    const amountColor = isCredit ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500";
    const iconColor = isCredit ? "text-green-500" : "text-red-500";
    const amountPrefix = isCredit ? '+' : '-';

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Icon className={`h-8 w-8 ${iconColor}`} />
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            <p className={`text-lg font-semibold ${amountColor}`}>
                {amountPrefix} ₹{transaction.amount.toFixed(2)}
            </p>
        </div>
    )
}


// --- Main Page Component ---
export default function UserDetailsPage() {
    const { data: balance, isLoading: isBalanceLoading } = useQuery({
        queryKey: ['balance'],
        queryFn: getBalance,
    });

    const { data: transactions, isLoading: areTransactionsLoading } = useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });

    if (isBalanceLoading || areTransactionsLoading) {
        return <UserDetailsSkeleton />;
    }

    return (
        <main className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto max-w-4xl p-4 py-8 md:py-12">
                <div className="space-y-8">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
                        <p className="text-muted-foreground">
                            View your balance and recent transaction history.
                        </p>
                    </div>

                    {/* Balance Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                ₹{balance ? balance.toFixed(2) : '0.00'}
                            </p>
                            <p className="text-xs text-muted-foreground pt-1">
                                Some transactions may take up to 24hrs to reflect.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Recent Activities Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>A log of your recent credits and debits.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {transactions && transactions.length > 0 ? (
                                <div className="space-y-6">
                                    {transactions.map((transaction, index) => (
                                        <div key={transaction.id}>
                                            <TransactionItem transaction={transaction} />
                                            {index < transactions.length - 1 && <Separator className="mt-6" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground">No recent activity found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}