import { useQuery } from '@tanstack/react-query';
import { fetchRoutesFromAPI } from '../api/init';
import { busDB } from '../db/busDB';
import { isExpired } from '@/utils/time.utils';


async function getRoutes(): Promise<Record<string, string>> {
  const meta = await busDB.meta.get('lastRoutesUpdated');
  if (!meta || isExpired(meta.value)) {
    const routes = await fetchRoutesFromAPI();
    await busDB.routes.clear();
    await busDB.routes.bulkPut(routes);
    await busDB.meta.put({ key: 'lastRoutesUpdated', value: new Date().toISOString() });
  }

  const all = await busDB.routes.toArray();
  return Object.fromEntries(all.map(r => [r.id, r.route_number + ' - ' + r.route_name]));
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes,
    staleTime: Infinity,
  });
}
