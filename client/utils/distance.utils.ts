// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// NEW FUNCTION TO ADD
export function formatDistanceToNow(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;

    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;

    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;

    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;

    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;

    return `${Math.floor(seconds)}s ago`;
}