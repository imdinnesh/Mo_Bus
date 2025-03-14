import axios from "axios";
import { cookies } from "next/headers";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QRCodeResponse {
    qrcode: string; // Base64 encoded QR code
    start_stop: string; // Name of the start stop
    end_stop: string; // Name of the end stop
    created_at: string; // Timestamp in the format "YYYY-MM-DD HH:mm:ss.SSSSSS +TZ"
    expiry_time: string; // Timestamp in the format "YYYY-MM-DD HH:mm:ss.SSSSSS +TZ"
}

interface QRCodeListResponse {
    qrcodes: QRCodeResponse[]; // Array of QR code responses
}

export default async function QrCodes() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token");

    let data: QRCodeListResponse = { qrcodes: [] };
    let error: string | null = null;

    try {
        const response = await axios.get<QRCodeListResponse>("http://localhost:8080/qrcode/list", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token.value}` }),
            },
        });

        if (response.statusText === "OK") {
            data = response.data;
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "An error occurred while fetching QR Codes";
        console.error(error);
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Your Tickets</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.qrcodes.map((ticket, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {ticket.start_stop} to {ticket.end_stop}
                            </CardTitle>
                            <CardDescription>
                                Created: {new Date(ticket.created_at).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="flex justify-center">
                                <Image
                                    src={`data:image/png;base64,${ticket.qrcode}`}
                                    alt="QR Code"
                                    width={150}
                                    height={150}
                                    className="rounded-lg"
                                />
                            </div>
                            <Badge variant={new Date(ticket.expiry_time) > new Date() ? "default" : "destructive"}>
                                {new Date(ticket.expiry_time) > new Date() ? "Active" : "Expired"}
                            </Badge>
                            <p className="text-sm text-gray-600">
                                Expires: {new Date(ticket.expiry_time).toLocaleString()}
                            </p>
                            <Button variant="outline" className="w-full">
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}