import { MakePayment } from "@/components/make-payment";

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
            <MakePayment source={source} destination={destination} />
        </div>
    );
}