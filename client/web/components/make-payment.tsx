"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
interface PageProps {
    source?: string;
    destination?: string;
}
export const MakePayment = ({source,destination}:PageProps) => {

    const router=useRouter();

    const handlePayment =async() => {

        const data = {
            start_stop_id: source ? parseInt(source, 10) : undefined,
            end_stop_id: destination ? parseInt(destination, 10) : undefined,
        };

        const token=sessionStorage.getItem("token");

        try{
            const response=await axios.post("http://localhost:8080/bookings/",data,{
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })
            console.log("Payment successful",response);


        }catch(error){
            console.error("Error while making payment",error);
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage)
            } else {
                toast.error("An error occurred while making payment");
            }
        }

    }

    const handleCancel = () => {
        router.push("/dashboard");
    }


    return (
        <div>
            <h1>Payment Page</h1>
            <p>Source: {source}</p>
            <p>Destination: {destination}</p>
                <Button
                onClick={handlePayment} 
                type="submit">
                    Confirm Your Ticket
                </Button>
                <Button
                onClick={handleCancel}>
                    Cancel
                </Button>
        </div>
    );
}


