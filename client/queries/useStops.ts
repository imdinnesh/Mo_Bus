import { useQuery } from '@tanstack/react-query';
import { fetchStopsFromAPI } from '../api/init';
import { busDB } from '../db/busDB';

function isExpired(last: string, days = 1) {
  const now = Date.now();
  const then = new Date(last).getTime();
  return now - then > days * 24 * 60 * 60 * 1000;
}

async function getStops(): Promise<Record<string, string>> {
  const meta = await busDB.meta.get('lastStopsUpdated');
  if (!meta || isExpired(meta.value)) {
    const stops = await fetchStopsFromAPI();
    await busDB.stops.clear();
    await busDB.stops.bulkPut(stops);
    await busDB.meta.put({ key: 'lastStopsUpdated', value: new Date().toISOString() });
  }

  const all = await busDB.stops.toArray();
  return Object.fromEntries(all.map(s => [s.id, s.name]));
}

export function useStops() {
  return useQuery({
    queryKey: ['stops'],
    queryFn: getStops,
    staleTime: Infinity,
  });
}
