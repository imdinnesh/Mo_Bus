"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { useAddRoute } from "@/hooks/route-hooks"
import { addRoutePayload, addRouteSchema } from "@/api/route"

const directionOptions = [
  { value: 1, label: "Inbound", description: "Towards city center" },
  { value: 2, label: "Outbound", description: "Away from city center" },
]

export default function AddRoutePage() {
  const form = useForm<addRoutePayload>({
    resolver: zodResolver(addRouteSchema),
    defaultValues: {
      route_name: "",
      route_number: "",
      direction: 1,
    },
  })

  const mutation = useAddRoute()

  const onSubmit = async (data: addRoutePayload) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        setTimeout(() => mutation.reset(), 3000)
      },
      onError: () => {
        setTimeout(() => mutation.reset(), 3000)
      }
    })
  }

  return (
    // Black & White Theme Foundation
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/routes"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Routes
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Route</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Create a new transportation route in the system</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Alert - Themed Black & White */}
          {mutation.isSuccess && (
            <Alert className="mb-6 border-black bg-transparent dark:border-white">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Route has been successfully added to the system!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert - Themed Black & White */}
          {mutation.isError && (
            <Alert className="mb-6 border-black bg-transparent dark:border-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {mutation.error?.message || "An unknown error occurred."}
              </AlertDescription>
            </Alert>
          )}

          {/* Form Card - Themed Black & White */}
          <Card className="bg-transparent border-black dark:border-white">
            <CardHeader>
              <CardTitle>Route Information</CardTitle>
              <CardDescription className="text-neutral-500 dark:text-neutral-400">
                Enter the details for the new transportation route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Route Name Field */}
                  <FormField
                    control={form.control}
                    name="route_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nandankanan to Railway Station"
                            {...field}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormDescription className="text-neutral-500 dark:text-neutral-400">
                          A descriptive name that passengers will recognize.
                        </FormDescription>
                        <FormMessage className="text-black dark:text-white" />
                      </FormItem>
                    )}
                  />

                  {/* Route Number Field */}
                  <FormField
                    control={form.control}
                    name="route_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 11, 10" {...field} disabled={mutation.isPending} />
                        </FormControl>
                        <FormDescription className="text-neutral-500 dark:text-neutral-400">
                          The official identifier used in schedules.
                        </FormDescription>
                        <FormMessage className="text-black dark:text-white" />
                      </FormItem>
                    )}
                  />

                  {/* Direction Field */}
                  <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Direction</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                            value={String(field.value)}
                            className="grid grid-cols-1 gap-4"
                            disabled={mutation.isPending}
                          >
                            {directionOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value={String(option.value)} id={`direction-${option.value}`} />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={`direction-${option.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {option.label}
                                  </label>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{option.description}</p>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      disabled={mutation.isPending}
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex-1 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Route...
                        </>
                      ) : (
                        "Add Route"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}