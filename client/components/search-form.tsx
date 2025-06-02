"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchFormValues, SearchSchema } from "@/schemas/trip";
import { useTripStore } from "@/store/useTripStore";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useStops } from "@/hooks/useStops";
import { useRoutes } from "@/hooks/useRoutes";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";

type SearchResult = {
  id: string;
  label: string;
  type: "stop" | "route";
};

export function SearchForm() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");

  const setDestination = useTripStore((state) => state.setDestination);
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
      router.push(`/route?routeId=${encodeURIComponent(item.id)}`);
    } else {
      setDestination(item.id, item.label);
      router.push(`/trip-planner?destination=${encodeURIComponent(item.id)}`);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const routes = results.filter((r) => r.type === "route");
  const stops = results.filter((r) => r.type === "stop");

  const renderWithIcon = (item: SearchResult) => {
    const icon = item.type === "route" ? "🚌" : "📍";
    return (
      <Card
        key={`${item.type}-${item.id}`}
        onClick={() => handleClick(item)}
        className="cursor-pointer hover:bg-gray-100"
      >
        <CardContent className="p-4 flex items-center gap-2 text-sm">
          <span>{icon}</span>
          <span>{item.label}</span>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("query")}
          placeholder="Search route number or stop name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {errors.query && <p className="text-red-500 text-sm">{errors.query.message}</p>}
        <Button type="submit">Search</Button>
      </form>

      {results.length > 0 && (
        <div className="space-y-6">
          {routes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Routes</h4>
              <div className="space-y-2">{routes.map(renderWithIcon)}</div>
            </div>
          )}
          {stops.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Stops</h4>
              <div className="space-y-2">{stops.map(renderWithIcon)}</div>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-600">Recent Searches</h4>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
          {history.map(renderWithIcon)}
        </div>
      )}
    </div>
  );
}
