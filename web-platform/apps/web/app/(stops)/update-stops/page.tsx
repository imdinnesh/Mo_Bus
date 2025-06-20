// app/stops/page.tsx
"use client"

import { type FormEvent, type ReactNode, useState, useMemo, useCallback, memo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useGetStops, useAddStops, useUpdateStop, useDeleteStop } from "@/hooks/stops-hooks"

// Shadcn UI & Icons
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "sonner"
import {
    Bus,
    Loader2,
    Pencil,
    PlusCircle,
    Trash2,
    XCircle,
    MapPin,
    Search,
    X,
    MoreHorizontal,
    ArrowUpDown,
    Filter,
} from "lucide-react"

// Define types
type Stop = {
    id: string
    stop_name: string
}
type SortField = "name"
type SortDirection = "asc" | "desc"

// --- Reusable Action Components (Memoized for performance) ---

const AddStopDialog = memo(function AddStopDialog({ onActionSuccess, children }: { onActionSuccess: () => void; children: ReactNode }) {
    // ... (Component code remains the same as your version)
    const [stopName, setStopName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const addStopMutation = useAddStops()

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()
        if (!stopName.trim()) return
        addStopMutation.mutate({ stop_name: stopName.trim() }, {
            onSuccess: (data) => {
                toast.success(data.message || "Stop added successfully!")
                onActionSuccess()
                setIsOpen(false)
            },
            onError: (error) => { toast.error(error.message || "Failed to add stop.") },
        })
    }, [stopName, addStopMutation, onActionSuccess])

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open)
        if (!open) setStopName("")
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader><DialogTitle>Add New Stop</DialogTitle><DialogDescription>Enter the name for the new bus stop.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4"><Label htmlFor="stop-name">Stop Name</Label><Input id="stop-name" value={stopName} onChange={(e) => setStopName(e.target.value)} placeholder="e.g., BBSR Railway Station" required autoFocus maxLength={100} /></div>
                    <DialogFooter><Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={addStopMutation.isPending}>Cancel</Button><Button type="submit" disabled={addStopMutation.isPending || !stopName.trim()}>{addStopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{addStopMutation.isPending ? "Saving..." : "Save Stop"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})

const StopTableRow = memo(function StopTableRow({ stop, index, onActionSuccess }: { stop: Stop; index: number; onActionSuccess: () => void }) {
    // ... (Component code remains the same as your version)
    const [updatedStopName, setUpdatedStopName] = useState(stop.stop_name)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const updateStopMutation = useUpdateStop(stop.id)
    const deleteStopMutation = useDeleteStop(stop.id)

    const handleUpdate = useCallback((e: FormEvent) => {
        e.preventDefault()
        if (!updatedStopName.trim()) return
        updateStopMutation.mutate({ stop_name: updatedStopName.trim() }, {
            onSuccess: (data) => {
                toast.success(data.message || "Stop updated successfully!")
                onActionSuccess()
                setIsUpdateOpen(false)
            },
            onError: (error) => { toast.error(error.message || "Failed to update stop.") },
        })
    }, [updatedStopName, updateStopMutation, onActionSuccess])

    const handleDelete = useCallback(() => {
        deleteStopMutation.mutate(stop.id, {
            onSuccess: (data) => {
                toast.success(data.message || "Stop deleted successfully!")
                onActionSuccess()
            },
            onError: (error) => { toast.error(error.message || "Failed to delete stop.") },
        })
    }, [deleteStopMutation, stop.id, onActionSuccess])

    const handleUpdateOpenChange = useCallback((open: boolean) => {
        setIsUpdateOpen(open)
        if (open) setUpdatedStopName(stop.stop_name)
    }, [stop.stop_name])

    return (
        <TableRow className="group hover:bg-muted/30 transition-colors">
            <TableCell className="w-[60px] text-center font-medium text-muted-foreground py-3">{index + 1}</TableCell>
            <TableCell className="font-medium py-3"><div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" /><span className="truncate">{stop.stop_name}</span></div></TableCell>
            <TableCell className="w-[80px] text-center py-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
                        <Dialog open={isUpdateOpen} onOpenChange={handleUpdateOpenChange}>
                            <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem></DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]"><form onSubmit={handleUpdate}><DialogHeader><DialogTitle>Update Stop</DialogTitle><DialogDescription>Make changes to the stop name below.</DialogDescription></DialogHeader><div className="grid gap-4 py-4"><Label htmlFor="update-stop-name">Stop Name</Label><Input id="update-stop-name" value={updatedStopName} onChange={(e) => setUpdatedStopName(e.target.value)} required autoFocus maxLength={100} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setIsUpdateOpen(false)} disabled={updateStopMutation.isPending}>Cancel</Button><Button type="submit" disabled={updateStopMutation.isPending || !updatedStopName.trim()}>{updateStopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></DialogFooter></form></DialogContent>
                        </Dialog>
                        <DropdownMenuSeparator />
                        <AlertDialog><AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the stop: <span className="font-bold">{stop.stop_name}</span>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={deleteStopMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{deleteStopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Yes, delete it</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                    </DropdownMenuContent></DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    )
})

// --- Main Page Component ---
export default function GetStopsPage() {
    const queryClient = useQueryClient()
    const { data: stops, isLoading, error } = useGetStops()

    const [searchQuery, setSearchQuery] = useState("")
    const [sortField, setSortField] = useState<SortField>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    const handleActionSuccess = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["get-stops"] })
    }, [queryClient])

    const filteredAndSortedStops = useMemo(() => {
        if (!stops) return []
        const filtered = stops.filter((stop: any) => stop.stop_name.toLowerCase().includes(searchQuery.toLowerCase()))
        filtered.sort((a: any, b: any) => {
            const comparison = a.stop_name.localeCompare(b.stop_name)
            return sortDirection === "asc" ? comparison : -comparison
        })
        return filtered
    }, [stops, searchQuery, sortDirection])

    const handleSort = useCallback(() => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    }, [])

    const clearSearch = useCallback(() => setSearchQuery(""), [])

    if (isLoading) {
        return (<div className="flex h-screen flex-col items-center justify-center gap-4"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /><p className="text-lg text-muted-foreground">Loading Stops...</p></div>)
    }

    if (error) {
        return (<div className="flex h-screen items-center justify-center p-4"><Card className="w-full max-w-md text-center"><CardHeader><div className="mx-auto bg-destructive/10 p-3 rounded-full"><XCircle className="w-10 h-10 text-destructive" /></div><CardTitle className="mt-4 text-destructive">Failed to Load Stops</CardTitle><CardDescription className="text-destructive/80">There was an error fetching data.<p className="mt-4 text-xs font-mono p-2 bg-destructive/5 rounded border border-destructive/20 text-destructive/80">{error.message}</p></CardDescription></CardHeader></Card></div>)
    }

    return (
        // Core layout: flex column filling the screen
        <main className="flex h-screen flex-col gap-4 p-4">
            <header className="flex flex-shrink-0 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg"><Bus className="h-6 w-6 text-primary" /></div>
                    <div>
                        <h1 className="text-2xl font-bold">Bus Stops</h1>
                        <p className="text-muted-foreground">Manage all registered bus stops.</p>
                    </div>
                </div>
                <AddStopDialog onActionSuccess={handleActionSuccess}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" />Add Stop</Button>
                </AddStopDialog>
            </header>

            {/* Card now acts as the main container for the list, growing to fill space */}
            <Card className="flex flex-1 flex-col overflow-hidden">
                {/* Toolbar: Search and Filter (fixed, does not scroll) */}
                <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search stops..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-10" />
                        {searchQuery && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}><X className="h-4 w-4" /></Button>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleSort} className="w-full sm:w-auto">
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            <span>Sort by Name ({sortDirection === "asc" ? "A-Z" : "Z-A"})</span>
                        </Button>
                        {stops && <Badge variant="secondary">{filteredAndSortedStops.length} / {stops.length}</Badge>}
                    </div>
                </div>

                {/* Scrollable area for the table */}
                <CardContent className="flex-1 overflow-y-auto p-0 px-5">
                    <Table>
                        {/* Sticky header stays visible on scroll */}
                        <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                            <TableRow>
                                <TableHead className="w-[60px] text-center">#</TableHead>
                                <TableHead>Stop Name</TableHead>
                                <TableHead className="w-[80px] text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedStops.length > 0 ? (
                                filteredAndSortedStops.map((stop: any, index: any) => <StopTableRow key={stop.id} stop={stop} index={index} onActionSuccess={handleActionSuccess} />)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-[50vh]">
                                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                                            {searchQuery ? (
                                                <>
                                                    <Search className="h-12 w-12 text-muted-foreground/30" />
                                                    <h3 className="text-lg font-semibold">No Results Found</h3>
                                                    <p className="text-muted-foreground">Your search for "{searchQuery}" did not return any results.</p>
                                                    <Button variant="outline" size="sm" onClick={clearSearch}>Clear Search</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="h-12 w-12 text-muted-foreground/30" />
                                                    <h3 className="text-lg font-semibold">No Stops Added Yet</h3>
                                                    <p className="text-muted-foreground">Get started by adding your first bus stop.</p>
                                                    <AddStopDialog onActionSuccess={handleActionSuccess}><Button><PlusCircle className="mr-2 h-4 w-4" />Add First Stop</Button></AddStopDialog>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}