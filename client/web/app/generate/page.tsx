import { Suspense } from "react"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function GenerateQrCodePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const ticket_id = searchParams.id ? Number(searchParams.id) : undefined
    const source_stop = searchParams.from as string | undefined
    const destination_stop = searchParams.to as string | undefined

    if (!ticket_id || !source_stop || !destination_stop) {
        return (
            <div className="container max-w-md mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Invalid Ticket Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Missing required ticket information. Please ensure you have a valid ticket ID, source, and destination.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-md mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Your Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ticket ID:</span>
                            <span className="font-medium">{ticket_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">From:</span>
                            <span className="font-medium">{source_stop}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">To:</span>
                            <span className="font-medium">{destination_stop}</span>
                        </div>
                    </div>

                    <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                        <QrCodeGenerator ticket_id={ticket_id} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

