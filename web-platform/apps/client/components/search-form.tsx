"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchFormValues, SearchSchema } from "@workspace/shared/schemas/trip";
import { useTripStore } from "@/store/useTripStore";
import { useRouter } from "next/navigation";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { useStops } from "@/hooks/useStops";
import { useRoutes } from "@/hooks/useRoutes";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";
import { Search, Bus, MapPin, Clock, X } from "lucide-react";

type SearchResult = {
  id: string;
  label: string;
  type: "stop" | "route";
  route_number?: string; // for routes
};

export function SearchForm() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");

  const setDestination = useTripStore((state) => state.setDestination);
  const setRoute = useTripStore((state) => state.setRoute);
  const router = useRouter();

  const { data: stopsMap } = useStops();
  const { data: routesMap } = useRoutes();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(SearchSchema),
  });

  useEffect(() => {
    const raw = localStorage.getItem("searchHistory");
    if (raw) {
      const parsed: SearchResult[] = JSON.parse(raw);
      const seen = new Set();
      const unique = parsed.filter((item) => {
        const key = `${item.type}-${item.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setHistory(unique);
    }
  }, []);

  const saveHistory = (item: SearchResult) => {
    setHistory((prev) => {
      const withoutDup = prev.filter((r) => `${r.type}-${r.id}` !== `${item.type}-${item.id}`);
      const newHistory = [item, ...withoutDup].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const stopsArray = useMemo(() => {
    if (!stopsMap) return [];
    return Object.entries(stopsMap).map(([id, stop_name]) => ({
      id,
      stop_name,
    }));
  }, [stopsMap]);

  const routesArray = useMemo(() => {
    if (!routesMap) return [];
    return Object.entries(routesMap).map(([id, label]) => {
      const [route_number, ...nameParts] = label.split(" - ");
      const route_name = nameParts.join(" - ");
      return {
        id,
        route_number,
        route_name,
      };
    });
  }, [routesMap]);

  const performSearch = async (input: string) => {
    if (!input.trim()) {
      setResults([]);
      return;
    }

    const stopFuse = new Fuse(stopsArray, {
      keys: ["stop_name"],
      threshold: 0.3,
    });

    const routeFuse = new Fuse(routesArray, {
      keys: ["route_number", "route_name"],
      threshold: 0.3,
    });

    const stopResults: SearchResult[] = stopFuse.search(input).map((res) => ({
      id: res.item.id,
      label: res.item.stop_name,
      type: "stop",
    }));

    const routeResults: SearchResult[] = routeFuse.search(input).map((res) => ({
      id: res.item.id,
      label: `Route ${res.item.route_number} - ${res.item.route_name}`,
      type: "route",
      route_number: res.item.route_number,
    }));

    const combined = [...routeResults, ...stopResults];
    const seen = new Set<string>();
    const unique = combined.filter((item) => {
      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setResults(unique);
  };

  const debouncedSearch = useMemo(() => debounce(performSearch, 300), [stopsArray, routesArray]);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const onSubmit = () => {
    performSearch(query);
  };

  const handleClick = (item: SearchResult) => {
    saveHistory(item);
    if (item.type === "route") {
      setRoute(item.id, item.route_number || "");
      router.push(`/route-details?routeId=${encodeURIComponent(item.id)}`);
    } else {
      setDestination(item.id, item.label);
      router.push(`/trip-planner?destId=${encodeURIComponent(item.id)}`);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const routes = results.filter((r) => r.type === "route");
  const stops = results.filter((r) => r.type === "stop");

  const renderWithIcon = (item: SearchResult) => {
    const icon = item.type === "route" ? (
      <Bus className="h-4 w-4 text-blue-500" />
    ) : (
      <MapPin className="h-4 w-4 text-green-500" />
    );
    return (
      <div
        key={`${item.type}-${item.id}`}
        onClick={() => handleClick(item)}
        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      >
        <div className="mr-3 bg-gray-100 p-2 rounded-full">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-xs text-gray-500 capitalize">{item.type}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold">Find routes & stops</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="relative">
              <Input
                {...register("query")}
                placeholder="Search by route number or stop name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 py-5 text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.query && (
              <p className="text-red-500 text-sm px-2">{errors.query.message}</p>
            )}
            <Button type="submit" className="w-full py-5">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {(results.length > 0 || history.length > 0) && (
        <Card className="mt-2 shadow-lg rounded-lg max-h-[400px] overflow-y-auto">
          <CardContent className="p-4 space-y-4">
            {results.length > 0 ? (
              <div className="space-y-4">
                {routes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Routes
                    </h4>
                    <div className="space-y-1">{routes.map(renderWithIcon)}</div>
                  </div>
                )}
                {stops.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Stops
                    </h4>
                    <div className="space-y-1">{stops.map(renderWithIcon)}</div>
                  </div>
                )}
              </div>
            ) : history.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider">
                      Recent Searches
                    </h4>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" /> Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {history.map(renderWithIcon)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}