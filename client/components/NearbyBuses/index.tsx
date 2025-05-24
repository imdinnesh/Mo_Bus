"use client";
import { PrimaryButton } from "../shared/primary-btn";
import { TbBusStop } from "react-icons/tb";
import { BusList } from "./BusList";
export default function NearbyBuses() {
    return (
            <div className="flex flex-col w-4/12 p-4 border-2 border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">Nearest Bus Stop</h2>
                    <PrimaryButton onClick={() => console.log("Hello")}>See All</PrimaryButton>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <TbBusStop className="text-2xl" />
                    <h2 className="font-medium">
                    Jaydev Vihar Square
                    </h2>
                </div>
                <div>
                    <p className="bg-gray-200 w-20 p-1 mt-2 rounded-sm">Next Bus</p>

                </div>
                <BusList/>
            </div>
        )
}