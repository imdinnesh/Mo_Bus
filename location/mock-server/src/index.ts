import axios from 'axios';

// Backend endpoint
const BACKEND_URL = 'http://localhost:3001/location';

// Number of buses to simulate
const BUS_COUNT = 5;

// Bounding box for random coordinates (e.g., Bhubaneswar)
const LAT_RANGE: [number, number] = [20.26, 20.36];
const LON_RANGE: [number, number] = [85.78, 85.86];

// Randomly choose between 2 or 3 seconds
function randomInterval(): number {
  return Math.random() < 0.5 ? 2000 : 3000;
}

// Generate random float between min and max
function randomCoord(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate random coordinates within the bounding box
function getRandomLocation(): { latitude: number; longitude: number } {
  return {
    latitude: parseFloat(randomCoord(...LAT_RANGE).toFixed(6)),
    longitude: parseFloat(randomCoord(...LON_RANGE).toFixed(6))
  };
}

// Generate bus ID like 'bus-100', 'bus-101', ...
function generateBusId(index: number): string {
  return `bus-${100 + index}`;
}

// Simulate a single bus sending coordinates every 2-3 seconds
async function simulateBus(busId: string, routeId: string): Promise<void> {
  while (true) {
    const { latitude, longitude } = getRandomLocation();

    const payload = {
      busId,
      routeId,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
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
  const routeId = `route-${String.fromCharCode(65 + i)}`; // route-A, B, C...
  simulateBus(busId, routeId);
}
