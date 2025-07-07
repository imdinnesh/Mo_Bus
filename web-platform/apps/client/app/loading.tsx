// app/loading.tsx
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-black">
            <div className="flex w-full max-w-sm flex-col items-center space-y-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
                {/* Simulating a header/avatar section */}
                <div className="flex w-full items-center space-x-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>

                {/* Simulating content blocks */}
                <div className="w-full space-y-3 pt-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-5 w-full" />
                </div>

                {/* Simulating a button */}
                <div className="w-full pt-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}