"use client";
import { IconButton } from "../shared/icon-btn";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbTransactionRupee } from "react-icons/tb";
export default function BusCard() {
    return (
        <div className="flex flex-col w-4/12 p-4 gap-y-4 border-2 border-gray-200 rounded-md">
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Your Bus Card</h2>
            </div>
            <div className="flex flex-row items-center gap-2">

                <IconButton onClick={() => console.log("Icon")}>
                    <div className="flex flex-row items-center gap-2">
                        <MdOutlineAccountBalanceWallet className="text-2xl text-blue-600" />
                        View Balance
                    </div>
                </IconButton>
                <IconButton onClick={() => console.log("Icon")}>
                    <div className="flex flex-row items-center gap-2">
                        <TbTransactionRupee className="text-2xl text-blue-600" />
                        Recharge Card
                    </div>
                </IconButton>
            </div>
        </div>
    )
}