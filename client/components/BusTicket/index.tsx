"use client";
import { PrimaryButton } from "@/components/shared/primary-btn";
import { IconButton } from "../shared/icon-btn";
import { LuTicket } from "react-icons/lu";
import { BsPassport } from "react-icons/bs";
export default function BusTicket() {
    return (
        <div className="flex flex-col w-4/12 p-4 gap-y-4 border-2 border-gray-200 rounded-md">
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Buy bus tickets / pass</h2>
                <PrimaryButton onClick={() => console.log("Hello")}>See All</PrimaryButton>
            </div>
            <div className="flex flex-row items-center gap-2">

                <IconButton onClick={() => console.log("Icon")}>
                    <div className="flex flex-row items-center gap-2">
                        <LuTicket className="text-2xl text-blue-600" />
                        One Way Ticket
                    </div>
                </IconButton>
                <IconButton onClick={() => console.log("Icon")}>
                    <div className="flex flex-row items-center gap-2">
                        <BsPassport className="text-2xl text-blue-600" />
                        Bus Pass
                    </div>
                </IconButton>
            </div>
        </div>
    )
}