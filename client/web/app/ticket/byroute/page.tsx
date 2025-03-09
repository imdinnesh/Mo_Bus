import { BookTicket } from "@/components/book-ticket"
export default function Tickets() {
    const route_no = "R1"

    return (
        <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
            <BookTicket route_no={route_no} />

        </div>
    )
}