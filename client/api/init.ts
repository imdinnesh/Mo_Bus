import { Stop,Route } from '../db/busDB';

export async function fetchStopsFromAPI(): Promise<Stop[]> {
  return [
    { id: 's1', name: 'Main Street' },
    { id: 's2', name: 'Central Park' },
    { id: 's3', name: 'Airport Road' },
  ];
}

export async function fetchRoutesFromAPI(): Promise<Route[]> {
  return [
    { id: 'r1', number: '101A' },
    { id: 'r2', number: 'Express 9' },
  ];
}


