"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { addRoutePayload } from "@/api/route";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "sonner";
import {
  useAddRoute,
  useGetRouteById,
  useUpdateRoute,
} from "@/hooks/route-hooks";

interface RouteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  routeId?: string | null;
}

// The form schema now requires all fields for both add and edit operations.
// z.coerce.number() is used to automatically convert the string from the Select input to a number.
const formSchema = z.object({
  route_number: z.string().min(1, "Route number is required"),
  route_name: z.string().min(1, "Route name is required"),
  direction: z.coerce
    .number({ invalid_type_error: "Direction is required" })
    .min(1, "Direction must be selected"),
});
type FormValues = z.infer<typeof formSchema>;

export function RouteFormDialog({
  isOpen,
  onClose,
  routeId,
}: RouteFormDialogProps) {
  const isEditMode = !!routeId;

  const { data: routeData, isLoading: isRouteLoading } = useGetRouteById(
    routeId!
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      route_number: "",
      route_name: "",
      direction: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && routeData?.route) {
      form.reset({
        route_name: routeData.route.route_name,
        route_number: routeData.route.route_number,
        direction: routeData.route.direction,
      });
    } else if (!isEditMode) {
      form.reset({
        route_name: "",
        route_number: "",
        direction: undefined,
      });
    }
  }, [isEditMode, routeData, form]);

  const addMutation = useAddRoute();
  const updateMutation = useUpdateRoute(routeId!);

  const onSubmit = (values: FormValues) => {
    if (isEditMode) {
      updateMutation.mutate(values, {
        onSuccess: (data) => {
          toast.success(data.message || "Route updated successfully!");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to update route.");
        },
      });
    } else {
      addMutation.mutate(values as addRoutePayload, {
        onSuccess: () => {
          // The hook already shows a toast, so we just close the dialog
          onClose();
        },
        // onError is handled by the hook
      });
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-neutral-800">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Route" : "Add New Route"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of the existing route."
              : "Fill in the details to create a new route."}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && isRouteLoading ? (
          <div className="py-8 text-center">Loading route data...</div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="route_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 42C"
                        {...field}
                        className="bg-neutral-900 border-neutral-700 focus:ring-neutral-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="route_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Broadway - Downtown"
                        {...field}
                        className="bg-neutral-900 border-neutral-700 focus:ring-neutral-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* This field is now visible in both "Add" and "Edit" modes */}
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-neutral-900 border-neutral-700">
                          <SelectValue placeholder="Select a direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-neutral-900 border-neutral-700 text-foreground">
                        <SelectItem value="1">1 - Up</SelectItem>
                        <SelectItem value="2">2 - Down</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isMutating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isMutating}>
                  {isMutating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}