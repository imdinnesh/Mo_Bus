"use client";

import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetRoutes,
  useDeleteRoute,
} from "@/hooks/route-hooks";


// Shadcn UI & Icons
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
} from "@workspace/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "sonner";
import {
  Route as RouteIcon,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  XCircle,
  Search,
  X,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { RouteFormDialog } from "@/components/routes/route-form-dialog";

// --- Type Definitions ---
type Route = {
  id: number;
  route_number: string;
  route_name: string;
  direction: number;
};
type SortField = "route_number" | "route_name";
type SortDirection = "asc" | "desc";

// --- Reusable Table Row Component ---
function RouteTableRow({
  route,
  index,
  onEdit,
  onActionSuccess,
}: {
  route: Route;
  index: number;
  onEdit: (id: string) => void;
  onActionSuccess: () => void;
}) {
  const deleteRouteMutation = useDeleteRoute();

  const handleDelete = useCallback(() => {
    deleteRouteMutation.mutate(route.id.toString(), {
      onSuccess: (data) => {
        toast.success(data.message || "Route deleted successfully!");
        onActionSuccess();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to delete route.");
      },
    });
  }, [deleteRouteMutation, route.id, onActionSuccess]);

  // In your RouteTableRow component

  const directionInfo = {
    1: {
      text: "Towards the center",
      // "Filled" look: Uses the foreground color as the background
      className: "bg-foreground text-background border-transparent hover:bg-foreground/80"
    },
    2: {
      text: "Away from the center",
      // Standard "outline" look
      className: "text-muted-foreground border-border"
    },
  }[route.direction] || { text: "N/A", className: "bg-muted text-muted-foreground" };

  return (
    <TableRow className="group hover:bg-muted/30 transition-colors">
      <TableCell className="w-[60px] text-center font-medium text-muted-foreground py-3">{index + 1}</TableCell>
      <TableCell className="w-[120px] font-mono text-center">
        <Badge variant="outline">{route.route_number}</Badge>
      </TableCell>
      <TableCell className="font-medium py-3">{route.route_name}</TableCell>
      <TableCell className="w-[100px] text-center">
        <Badge variant="outline" className={directionInfo.className}>{directionInfo.text}</Badge>
      </TableCell>
      <TableCell className="w-[80px] text-center py-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(route.id.toString())}>
                <Pencil className="mr-2 h-4 w-4" />Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the route: <br />
                      <span className="font-bold">{route.route_number} - {route.route_name}</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleteRouteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {deleteRouteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Yes, delete it
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Main Page Component ---
export default function RoutesPage() {
  const queryClient = useQueryClient();
  const { data: response, isLoading, error } = useGetRoutes();
  const routes = response?.routes || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({ field: 'route_number', direction: 'asc' });

  // State for controlling the Add/Edit dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleActionSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["get-routes"] });
  }, [queryClient]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRouteId(null);
    handleActionSuccess(); // Refresh data on close
  };

  const handleAddNew = () => {
    setSelectedRouteId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRouteId(id);
    setIsFormOpen(true);
  };

  const filteredAndSortedRoutes = useMemo(() => {
    if (!routes) return [];

    const filtered = routes.filter((route: Route) =>
      route.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.route_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a: Route, b: Route) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [routes, searchQuery, sortConfig]);

  const handleSort = useCallback((field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Loading Routes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle className="mt-4 text-destructive">Failed to Load Routes</CardTitle>
            <CardDescription className="text-destructive/80">
              There was an error fetching data.
              <p className="mt-4 text-xs font-mono p-2 bg-destructive/5 rounded border border-destructive/20 text-destructive/80">{error.message}</p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    // Core layout: flex column filling the screen
    <main className="flex h-screen flex-col gap-4 p-4 lg:p-6">
      <header className="flex flex-shrink-0 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <RouteIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bus Routes</h1>
            <p className="text-muted-foreground">Manage all registered bus routes.</p>
          </div>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />Add Route
        </Button>
      </header>

      {/* Card now acts as the main container for the list, growing to fill space */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar: Search and Filter (fixed, does not scroll) */}
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by route name or number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-10" />
            {searchQuery && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}><X className="h-4 w-4" /></Button>}
          </div>
          <div className="flex items-center gap-2">
            {routes && <Badge variant="secondary">{filteredAndSortedRoutes.length} / {routes.length}</Badge>}
          </div>
        </div>

        {/* Scrollable area for the table */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <Table>
            {/* Sticky header stays visible on scroll */}
            <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
              <TableRow>
                <TableHead className="w-[60px] text-center">#</TableHead>
                <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('route_number')}>
                  <div className="flex items-center justify-center gap-2">
                    Route No. <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('route_name')}>
                  <div className="flex items-center gap-2">
                    Route Name <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-center">Direction</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRoutes.length > 0 ? (
                filteredAndSortedRoutes.map((route, index) => (
                  <RouteTableRow
                    key={route.id}
                    route={route}
                    index={index}
                    onEdit={handleEdit}
                    onActionSuccess={handleActionSuccess}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-[50vh]">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      {searchQuery ? (
                        <>
                          <Search className="h-12 w-12 text-muted-foreground/30" />
                          <h3 className="text-lg font-semibold">No Results Found</h3>
                          <p className="text-muted-foreground">Your search for "{searchQuery}" did not return any routes.</p>
                          <Button variant="outline" size="sm" onClick={clearSearch}>Clear Search</Button>
                        </>
                      ) : (
                        <>
                          <RouteIcon className="h-12 w-12 text-muted-foreground/30" />
                          <h3 className="text-lg font-semibold">No Routes Added Yet</h3>
                          <p className="text-muted-foreground">Get started by adding your first bus route.</p>
                          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" />Add First Route</Button>
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

      {/* The Add/Edit Dialog */}
      {isFormOpen && (
        <RouteFormDialog
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          routeId={selectedRouteId}
        />
      )}
    </main>
  );
}