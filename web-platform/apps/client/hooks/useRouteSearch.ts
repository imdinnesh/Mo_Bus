import Fuse from "fuse.js";

export function useRouteSearch(routesMap: Record<string, string>) {
    const routesArray = Object.entries(routesMap).map(([id, label]) => {
        const [route_number, ...nameParts] = label.split(" - ");
        const route_name = nameParts.join(" - ");
        return {
            id,
            route_number,
            route_name,
        };
    });

    const fuse = new Fuse(routesArray, {
        keys: ["route_number", "route_name"],
        threshold: 0.3,
    });

    const searchRoutes = (query: string) =>
        fuse.search(query).map((res) => res.item);

    return { searchRoutes, routesArray };
}
