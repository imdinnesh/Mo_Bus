"use client"

import type * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RouteStop {
    stop_id: number
    stop_name: string
}

interface SelectStopProps {
    routestops: RouteStop[]
    onSelectStop: (stop: RouteStop | null) => void
    selectedStop: RouteStop | null
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    label?: string
}

export function SelectStop({ routestops, onSelectStop, selectedStop, open, setOpen, label }: SelectStopProps) {
    const handleSelect = (stop: RouteStop) => {
        onSelectStop(stop)
        setOpen(false)
    }

    const handleClear = () => {
        onSelectStop(null)
        setOpen(false)
    }

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between px-4 py-6 text-base transition-all duration-200",
                            open && "ring-2 ring-primary ring-offset-2",
                            selectedStop && "border-primary/50 bg-primary/5"
                        )}
                    >
                        <div className="flex items-center gap-3 truncate">
                            {selectedStop ? (
                                <>
                                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                                    <div className="flex flex-col items-start gap-0.5 text-left">
                                        <span className="font-medium">{selectedStop.stop_name}</span>
                                        <span className="text-xs text-muted-foreground">Stop ID: {selectedStop.stop_id}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        {label ? `Select ${label}...` : "Select stop..."}
                                    </span>
                                </>
                            )}
                        </div>
                        <ChevronsUpDown className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            open && "rotate-180"
                        )} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[min(95vw,500px)] p-0 shadow-lg" align="start">
                    <Command className="w-full rounded-lg">
                        <div className="px-3 pt-3 pb-2">
                            <CommandInput 
                                placeholder={`Search ${label?.toLowerCase() || "stop"}...`} 
                                className="h-12 text-base bg-transparent outline-none border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        <CommandList>
                            <CommandEmpty className="py-6 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <MapPin className="h-6 w-6 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        No stops found. Try a different search.
                                    </p>
                                </div>
                            </CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-[300px]">
                                    {routestops.map((stop) => (
                                        <CommandItem
                                            key={stop.stop_id}
                                            value={stop.stop_name}
                                            onSelect={() => handleSelect(stop)}
                                            className={cn(
                                                "flex items-center py-3 px-4 cursor-pointer transition-colors",
                                                selectedStop?.stop_id === stop.stop_id && "bg-primary/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <MapPin
                                                    className={cn(
                                                        "h-5 w-5 shrink-0",
                                                        selectedStop?.stop_id === stop.stop_id 
                                                            ? "text-primary" 
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className={cn(
                                                        "truncate",
                                                        selectedStop?.stop_id === stop.stop_id && "font-medium"
                                                    )}>
                                                        {stop.stop_name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Stop ID: {stop.stop_id}
                                                    </span>
                                                </div>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 shrink-0 transition-opacity duration-200",
                                                    selectedStop?.stop_id === stop.stop_id 
                                                        ? "opacity-100 text-primary" 
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </ScrollArea>
                            </CommandGroup>
                            {selectedStop && (
                                <>
                                    <CommandSeparator />
                                    <CommandItem
                                        onSelect={handleClear}
                                        className="py-3 px-4 text-sm justify-center text-muted-foreground hover:text-destructive focus:text-destructive"
                                    >
                                        Clear Selection
                                    </CommandItem>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}