export interface Route {
    id: number;
    route_number: string;
    route_name: string;
    direction: 1 | 2;
}

export interface GetRoutesResponse {
    status: string;
    message: string;
    routes: Route[];
}

export interface DefaultResponse{
    status: string;
    message: string;
}
