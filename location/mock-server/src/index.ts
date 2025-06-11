import axios from 'axios';

// Backend endpoint
const BACKEND_URL = 'http://localhost:3001/location';

// Number of buses to simulate
const BUS_COUNT = 5;

// Define fixed routes for buses (simplified for example)
const ROUTES: { [key: string]: { latitude: number; longitude: number }[] } = {
  "route-A": [
    { latitude: 20.270, longitude: 85.800 },
    { latitude: 20.275, longitude: 85.805 },
    { latitude: 20.280, longitude: 85.810 },
    { latitude: 20.285, longitude: 85.815 },
    { latitude: 20.290, longitude: 85.820 },
  ],
  "route-B": [
    { latitude: 20.260, longitude: 85.790 },
    { latitude: 20.265, longitude: 85.795 },
    { latitude: 20.270, longitude: 85.800 },
    { latitude: 20.275, longitude: 85.805 },
    { latitude: 20.280, longitude: 85.810 },
  ],
  "route-C": [
    { latitude: 20.300, longitude: 85.820 },
    { latitude: 20.295, longitude: 85.815 },
    { latitude: 20.290, longitude: 85.810 },
    { latitude: 20.285, longitude: 85.805 },
    { latitude: 20.280, longitude: 85.800 },
  ],
  "route-D": [
    { latitude: 20.310, longitude: 85.830 },
    { latitude: 20.305, longitude: 85.825 },
    { latitude: 20.300, longitude: 85.820 },
    { latitude: 20.295, longitude: 85.815 },
    { latitude: 20.290, longitude: 85.810 },
  ],
  "route-E": [
    { latitude: 20.265, longitude: 85.785 },
    { latitude: 20.270, longitude: 85.790 },
    { latitude: 20.275, longitude: 85.795 },
    { latitude: 20.280, longitude: 85.800 },
    { latitude: 20.285, longitude: 85.805 },
  ],
};

// Randomly choose between 2 or 3 seconds
function randomInterval(): number {
  return Math.random() < 0.5 ? 2000 : 3000;
}

// Generate bus ID like 'bus-100', 'bus-101', ...
function generateBusId(index: number): string {
  return `bus-${100 + index}`;
}

// Simulate a single bus moving along its route
async function simulateBus(busId: string, routeId: string): Promise<void> {
  const route = ROUTES[routeId];
  if (!route) {
    console.error(`No route found for ${routeId}`);
    return;
  }

  let currentIndex = 0;
  let current = { ...route[0] };
  let targetIndex = 1;

  const stepSize = 0.0002;

  while (true) {
    const next = route[targetIndex];

    // Compute direction vector
    const deltaLat = next.latitude - current.latitude;
    const deltaLon = next.longitude - current.longitude;
    const distance = Math.sqrt(deltaLat ** 2 + deltaLon ** 2);

    // Normalize direction and step
    const stepLat = (deltaLat / distance) * stepSize;
    const stepLon = (deltaLon / distance) * stepSize;

    // Update position
    current.latitude += stepLat;
    current.longitude += stepLon;

    // If close to next point, move to the next one
    if (Math.abs(current.latitude - next.latitude) < stepSize && Math.abs(current.longitude - next.longitude) < stepSize) {
      targetIndex = (targetIndex + 1) % route.length;
    }

    const payload = {
      busId,
      routeId,
      latitude: parseFloat(current.latitude.toFixed(6)),
      longitude: parseFloat(current.longitude.toFixed(6)),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(BACKEND_URL, payload);
      console.log(`[${busId}] Sent:`, payload);
    } catch (error: any) {
      console.error(`[${busId}] Error:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, randomInterval()));
  }
}

// Start simulation for all buses
for (let i = 0; i < BUS_COUNT; i++) {
  const busId = generateBusId(i);
  const routeId = `route-${String.fromCharCode(65 + i)}`; // route-A, B, ...
  simulateBus(busId, routeId);
}
