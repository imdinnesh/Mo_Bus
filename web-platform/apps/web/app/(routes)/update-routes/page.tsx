"use client";

import React, { useState, useMemo } from "react";
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Route } from "@/types/route.types";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useDeleteRoute, useGetRoutes } from "@/hooks/route-hooks";
import { RouteFormDialog } from "@/components/routes/route-form-dialog";


// Helper to format direction
const formatDirection = (direction: 1 | 2) => {
  return direction === 1 ? "Up" : "Down";
};

export default function RoutesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setFormOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetRoutes();
  const deleteMutation = useDeleteRoute();

  const filteredRoutes = useMemo(() => {
    if (!data?.routes) return [];
    return data.routes.filter(
      (route) =>
        route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.route_number.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleAddNew = () => {
    setSelectedRouteId(null);
    setFormOpen(true);
  };

  const handleEdit = (routeId: string) => {
    setSelectedRouteId(routeId);
    setFormOpen(true);
  };

  const handleDelete = (routeId: string) => {
    setRouteToDelete(routeId);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (routeToDelete) {
      deleteMutation.mutate(routeToDelete, {
        onSuccess: (data) => {
          toast.success(data.message || "Route deleted successfully!");
          setRouteToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to delete route.");
        },
      });
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-neutral-800">
          <TableCell><Skeleton className="h-4 w-16 bg-neutral-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48 bg-neutral-800" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12 bg-neutral-800" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 bg-neutral-800" /></TableCell>
        </TableRow>
      ));
    }
    
    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-400 py-10">
            Error loading routes: {error?.message}
          </TableCell>
        </TableRow>
      );
    }
    
    if (filteredRoutes.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-neutral-400 py-10">
            No routes found.
          </TableCell>
        </TableRow>
      );
    }

    return filteredRoutes.map((route: Route) => (
      <TableRow key={route.id} className="border-neutral-800 hover:bg-neutral-900/50">
        <TableCell className="font-medium">{route.route_number}</TableCell>
        <TableCell>{route.route_name}</TableCell>
        <TableCell className="text-neutral-400">{formatDirection(route.direction)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-neutral-950 border-neutral-800 text-white">
              <DropdownMenuItem onSelect={() => handleEdit(String(route.id))}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDelete(String(route.id))} className="text-red-500 focus:text-white focus:bg-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div className="bg-black min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Routes Management</h1>
          <Button onClick={handleAddNew} className="bg-white text-black hover:bg-neutral-200">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle>All Routes</CardTitle>
             <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/3 pl-9 bg-neutral-900 border-neutral-700 focus:ring-neutral-500"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="w-[120px]">Route #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Direction</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Dialog */}
      <RouteFormDialog
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        routeId={selectedRouteId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-neutral-950 border-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              This action cannot be undone. This will permanently delete the route from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-neutral-700 hover:bg-neutral-800">
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}