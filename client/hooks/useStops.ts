import { useQuery } from '@tanstack/react-query';
import { fetchStopsFromAPI } from '../api/init';
import { busDB } from '../db/busDB';
import { isExpired } from '@/utils/time.utils';

async function getStops(): Promise<Record<string, string>> {
  const meta = await busDB.meta.get('lastStopsUpdated');
  if (!meta || isExpired(meta.value)) {
    const stops = await fetchStopsFromAPI();
    await busDB.stops.clear();
    await busDB.stops.bulkPut(stops);
    await busDB.meta.put({ key: 'lastStopsUpdated', value: new Date().toISOString() });
  }

  const all = await busDB.stops.toArray();
  return Object.fromEntries(all.map(s => [s.id, s.stop_name]));
}

export async function getStopNameByIdFromLocalDB(id: string | null): Promise<string | null> {
  if (!id) return null;
  const stop = await busDB.stops.get(id);
  return stop?.stop_name ?? null;
}

export function getStopNameById(stops: Record<string, string>, id: string | null) {
  if (!id || !stops) return null;
  return stops[id] || null;
}


export function useStops() {
  return useQuery({
    queryKey: ['stops'],
    queryFn: getStops,
    staleTime: Infinity,
  });
}

