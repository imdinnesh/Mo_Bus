// Stop detail
export type Stop = {
    id: number;
    stop_name: string;
};

// Route stop entry
export type RouteStop = {
    id: number;
    route_id: number;
    stop_id: number;
    stop_index: number;
    stop: Stop;
};

// Full response
export type RouteStopsResponse = {
    status: "success" | "error";
    message: string;
    route_stops: RouteStop[];
};
