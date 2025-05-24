"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";

export default function SearchBus() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit=(event: React.MouseEvent<HTMLButtonElement>)=>{
        console.log(searchTerm)
    }


    return (
        <div className="flex flex-row items-center justify-center gap-4 p-4">

            <Input
                type="text"
                placeholder="Enter Destination or route number"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-2/5"
            />
            <Button
            onClick={handleSubmit}
            >Search</Button>
        </div>

    )


}