import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { SingleStopForm } from "@/components/stops/single-stop-form";
import { BulkStopsForm } from "@/components/stops/bulk-stops-form";

export default function AddStopsPage() {
    return (
        <div className="flex justify-center items-start min-h-screen bg-background p-4 sm:p-8">
            <Tabs defaultValue="single" className="w-full max-w-xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Stop</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
                </TabsList>

                <TabsContent value="single">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add a Single Stop</CardTitle>
                            <CardDescription>
                                Enter the name of an individual stop to add it to the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SingleStopForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bulk">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Add Stops</CardTitle>
                            <CardDescription>
                                Add multiple stops at once by listing each one on a new line.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BulkStopsForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}