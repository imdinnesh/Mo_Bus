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
  return Object.fromEntries(all.map(s => [s.id, s.stop_name]));
}

// export async function getStopNameById(id: string): Promise<string | undefined> {
//   let stop = await busDB.stops.get(id);

//   if (!stop) {
//     try {
//       // Fallback to API
//       stop = await fetchStopById(id);

//       if (stop) {
//         await busDB.stops.put(stop);
//       }
//     } catch (error) {
//       console.error(`Failed to fetch stop ${id} from API`, error);
//     }
//   }

//   return stop?.stop_name;
// }

export async function getStopNameById(id: string): Promise<string | undefined> {
  let stop = await busDB.stops.get(id);
  
  if (!stop) {
    // Fallback: fetch all stops from API
    const stops = await fetchStopsFromAPI();
    await busDB.stops.clear();
    await busDB.stops.bulkPut(stops);
    await busDB.meta.put({ key: 'lastStopsUpdated', value: new Date().toISOString() });

    // Try again
    stop = await busDB.stops.get(id);
  }

  return stop?.stop_name;
}


export function useStops() {
  return useQuery({
    queryKey: ['stops'],
    queryFn: getStops,
    staleTime: Infinity,
  });
}

export function useStopName(id: string) {
  return useQuery({
    queryKey: ['stopName', id],
    queryFn: () => getStopNameById(id),
    enabled: !!id,
    staleTime: Infinity,
  });
}
