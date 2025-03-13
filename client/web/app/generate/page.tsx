import axios from "axios";

export default async function GenerateQrCode({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const ticket_id = searchParams.id;

    


    return (
        <div>
            <h1>Generate QR Code</h1>
            <p>Ticket ID: {ticket_id}</p>
        </div>
    );
}