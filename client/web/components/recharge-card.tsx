"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"


export const RechargeCard = () => {

    const [amount, setAmount] = useState(0)

    const handleRecharge = async () => {
        try{
            const token = sessionStorage.getItem("token")
            const response=await axios.post('http://localhost:8080/payment/add',{
                amount
            },{
                headers:{
                    'Content-Type':'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            })

            if(response.statusText==='OK'){
                toast.success(response.data.message || "Money added successfully")
            }
        }
        catch(error){
            if(axios.isAxiosError(error) && error.response){
                const errorMessage=error.response.data.error
                toast.error(errorMessage)
            }
            else{
                toast.error("An error occurred while adding money")
            }
        }
    }

    return (
        <>

            <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))} />
            <Button onClick={handleRecharge}>
                Add Money
            </Button>

        </>




    )












}