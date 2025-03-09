import axios from "axios";
type SearchParams = {
    source?: string;
    destination?: string;
};


interface PageProps {
    searchParams: SearchParams;
}

export default function PaymentPage({ searchParams }: PageProps) {
    // Access the query parameters with type safety
    const source = searchParams.source;
    const destination = searchParams.destination;

    

    return (
        <div>
            <h1>Payment Page</h1>

            <p>Source: {source}</p>
            <p>Destination: {destination}</p>
            

        </div>
    );
}
