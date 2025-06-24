// src/app/(dashboard)/routes/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
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
} from '@workspace/ui/components/alert-dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@workspace/ui/components/command';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
    Check,
    ChevronsUpDown,
    Pencil,
    PlusCircle,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useGetRoutes } from '@/hooks/route-hooks';
import { useGetStops } from '@/hooks/stops-hooks';
import {
    useAddRouteStop,
    useDeleteRouteStop,
    useGetRouteStops,
    useUpdateRouteStop,
} from '@/hooks/route-stop-hook';
import { cn } from '@workspace/ui/lib/utils';
import { Route } from '@/types/route.types';
import { RouteStopsResponse, Stop, RouteStop } from '@/types/routestops.types';

type QueryStateWrapperProps = {
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
};

const QueryStateWrapper = ({
    isLoading,
    isError,
    error,
    children,
    loadingComponent,
}: QueryStateWrapperProps) => {
    if (isLoading) return loadingComponent;
    if (isError)
        return (
            <p className="text-destructive text-center p-4">
                Error: {(error as Error)?.message || 'Failed to fetch data'}
            </p>
        );
    return children;
};

export default function RouteManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

    // --- Data Fetching ---
    const routesQuery = useGetRoutes();
    const stopsQuery = useGetStops();
    const routeStopsQuery = useGetRouteStops(selectedRouteId!);

    // Find the full route object for the selected ID
    const selectedRoute = useMemo(() => {
        return routesQuery.data?.routes.find(
            (r) => r.id.toString() === selectedRouteId
        );
    }, [selectedRouteId, routesQuery.data]);

    // Client-side filtering for routes
    const filteredRoutes = useMemo(() => {
        if (!routesQuery.data) return [];
        return routesQuery.data.routes.filter(
            (route) =>
                route.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                route.route_number.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [routesQuery.data, searchQuery]);

    return (
        <div className="h-[calc(100vh-4rem)] bg-background text-foreground grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* --- Left Column: Route List --- */}
            <Card className="md:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Routes</CardTitle>
                    <CardDescription>Select a route to manage its stops.</CardDescription>
                    <Input
                        placeholder="Search by name or number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-2"
                    />
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto">
                    <QueryStateWrapper
                        isLoading={routesQuery.isPending}
                        isError={routesQuery.isError}
                        error={routesQuery.error}
                        loadingComponent={<Skeleton className="w-full h-32" />}
                    >
                        <div className="space-y-2">
                            {filteredRoutes.length > 0 ? (
                                filteredRoutes.map((route: Route) => (
                                    <button
                                        key={route.id}
                                        onClick={() => setSelectedRouteId(route.id.toString())}
                                        className={cn(
                                            'w-full text-left p-3 rounded-md border transition-colors',
                                            selectedRouteId === route.id.toString()
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'hover:bg-accent'
                                        )}
                                    >
                                        <p className="font-semibold">{route.route_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            #{route.route_number} - Direction: {route.direction}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No routes found.
                                </p>
                            )}
                        </div>
                    </QueryStateWrapper>
                </CardContent>
            </Card>

            {/* --- Right Column: Stop Management --- */}
            <Card className="md:col-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle>
                        {selectedRoute
                            ? `Stops for ${selectedRoute.route_name}`
                            : 'Select a Route'}
                    </CardTitle>
                    <CardDescription>
                        {selectedRoute
                            ? 'Add, update, or remove stops for this route.'
                            : 'Choose a route from the list on the left to see its details.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto">
                    {selectedRouteId ? (
                        <div className="space-y-6">
                            <AddStopForm
                                routeId={selectedRouteId}
                                allStops={stopsQuery.data || []}
                                currentStopCount={
                                    routeStopsQuery.data?.route_stops
                                        ? routeStopsQuery.data.route_stops.length + 1
                                        : 1
                                }
                            />
                            <StopsTable
                                routeId={selectedRouteId}
                                routeStopsQuery={routeStopsQuery}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">
                                No route selected.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// --- Sub-component: Add Stop Form ---
function AddStopForm({
    routeId,
    allStops,
    currentStopCount,
}: {
    routeId: string;
    allStops: Stop[];
    currentStopCount: number;
}) {
    const [open, setOpen] = useState(false);
    const [selectedStopId, setSelectedStopId] = useState<string>('');

    const addRouteStopMutation = useAddRouteStop(routeId);

    const handleAddStop = () => {
        if (!selectedStopId) {
            toast.error('Please select a stop to add.');
            return;
        }

        addRouteStopMutation.mutate(
            {
                route_id: parseInt(routeId, 10),
                stop_id: parseInt(selectedStopId, 10),
                stop_index: currentStopCount, // Add to the end
            },
            {
                onSuccess: (data) => {
                    toast.success(data.message || 'Stop added successfully!');
                    setSelectedStopId('');
                },
                onError: (error: any) => {
                    toast.error(
                        error.response?.data?.error || 'Failed to add stop.'
                    );
                },
            }
        );
    };

    const selectedStopName =
        allStops.find((stop) => stop.id.toString() === selectedStopId)?.stop_name ||
        'Select a stop...';

    return (
        <div className="p-4 border rounded-lg bg-muted/40">
            <h3 className="font-semibold mb-2">Add New Stop</h3>
            <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            <span className="truncate">{selectedStopName}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search stops..." />
                            <CommandList>
                                <CommandEmpty>No stop found.</CommandEmpty>
                                <CommandGroup>
                                    {allStops.map((stop) => (
                                        <CommandItem
                                            key={stop.id}
                                            value={stop.stop_name}
                                            onSelect={() => {
                                                setSelectedStopId(stop.id.toString());
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selectedStopId === stop.id.toString()
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {stop.stop_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button onClick={handleAddStop} disabled={!selectedStopId || addRouteStopMutation.isPending}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {addRouteStopMutation.isPending ? "Adding..." : "Add"}
                </Button>
            </div>
        </div>
    );
}

// --- Sub-component: Stops Table ---
function StopsTable({
    routeId,
    routeStopsQuery,
}: {
    routeId: string;
    routeStopsQuery: any;
}) {
    const [stopToUpdate, setStopToUpdate] = useState<RouteStop | null>(null);
    const [newStopIndex, setNewStopIndex] = useState(0);

    const updateRouteStopMutation = useUpdateRouteStop(
        routeId,
        stopToUpdate?.id.toString() || ''
    );
    const deleteRouteStopMutation = useDeleteRouteStop(routeId);

    const handleUpdate = () => {
        if (!stopToUpdate) return;
        updateRouteStopMutation.mutate(
            { stop_index: newStopIndex },
            {
                onSuccess: (data) => {
                    toast.success(data.message || 'Stop updated!');
                    setStopToUpdate(null);
                },
                onError: (error: any) => {
                    toast.error(
                        error.response?.data?.error || 'Failed to update stop.'
                    );
                },
            }
        );
    };

    const handleDelete = (routeStopId: string) => {
        deleteRouteStopMutation.mutate(routeStopId, {
            onSuccess: (data) => {
                toast.success(data.message || 'Stop deleted successfully!');
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.error || 'Failed to delete stop.');
            }
        });
    };

    return (
        <div>
            <h3 className="font-semibold mb-2">Current Stops</h3>
            <div className="border rounded-lg">
                <QueryStateWrapper
                    isLoading={routeStopsQuery.isPending}
                    isError={routeStopsQuery.isError}
                    error={routeStopsQuery.error}
                    loadingComponent={<Skeleton className="w-full h-48" />}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Index</TableHead>
                                <TableHead>Stop Name</TableHead>
                                <TableHead className="text-right w-[150px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routeStopsQuery.data?.route_stops?.length > 0 ? (
                                routeStopsQuery.data.route_stops
                                    .sort((a: any, b: any) => a.stop_index - b.stop_index) // Ensure correct order
                                    .map((rs: RouteStop) => (
                                        <TableRow key={rs.id}>
                                            <TableCell className="font-medium">{rs.stop_index}</TableCell>
                                            <TableCell>{rs.stop.stop_name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Dialog
                                                    open={!!stopToUpdate && stopToUpdate.id === rs.id}
                                                    onOpenChange={(isOpen) => !isOpen && setStopToUpdate(null)}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setStopToUpdate(rs);
                                                            setNewStopIndex(rs.stop_index);
                                                        }}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Update Stop Index</DialogTitle>
                                                            <DialogDescription>
                                                                Change the order of '{rs.stop.stop_name}' in the route.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <Input
                                                                id="stop_index"
                                                                type="number"
                                                                value={newStopIndex}
                                                                onChange={(e) => setNewStopIndex(parseInt(e.target.value, 10) || 0)}
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setStopToUpdate(null)}>Cancel</Button>
                                                            <Button onClick={handleUpdate} disabled={updateRouteStopMutation.isPending}>
                                                                {updateRouteStopMutation.isPending ? "Saving..." : "Save Changes"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action will remove '{rs.stop.stop_name}' from this route. This cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(rs.id.toString())}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        This route has no stops yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </QueryStateWrapper>
            </div>
        </div>
    );
}