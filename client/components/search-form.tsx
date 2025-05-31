"use client";
import { SearchFormValues, SearchSchema } from "@/schemas/trip";
import { useTripStore } from '@/store/useTripStore';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function SearchForm() {
    const [results, setResults] = useState<string[]>([]);
    const [isNumber, setIsNumber] = useState<boolean | null>(null);
    const setDestination = useTripStore((state) => state.setDestination);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(SearchSchema),
    });

    const onSubmit = (data: SearchFormValues) => {
        const { query } = data;
        const isNumeric = /^\d+$/.test(query);
        setIsNumber(isNumeric);

        // Dummy data
        if (isNumeric) {
            setResults([`Route ${query}A`, `Route ${query}B`, `Route ${query}C`]);
        } else {
            setResults([`${query} Stop 1`, `${query} Stop 2`, `${query} Stop 3`]);
        }
    };

    const handleClick = (item: string) => {
        if (isNumber) {
            const routeId = encodeURIComponent(item);
            router.push(`/route/${routeId}`);
        } else {
            const encoded = encodeURIComponent(item);
            setDestination(item);
            router.push(`/trip-planner?destination=${encoded}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input {...register('query')} placeholder="Enter route number or stop name" />
                {errors.query && <p className="text-red-500 text-sm">{errors.query.message}</p>}
                <Button type="submit">Search</Button>
            </form>

            <div className="mt-6 space-y-3">
                {results.map((item, idx) => (
                    <Card key={idx} onClick={() => handleClick(item)} className="cursor-pointer hover:bg-gray-100">
                        <CardContent className="p-4">{item}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
