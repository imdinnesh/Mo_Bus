"use client";
export default function TicketPage() {

    const session_key = localStorage.getItem("session_key");

    



    return (
        <div>

            {session_key}
        </div>
    )

}