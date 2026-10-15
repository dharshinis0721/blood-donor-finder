export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates geodesic (Haversine) distance in kilometers between two lat/lng pairs.
 */
export function calculateStraightLineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Approximates realistic road driving distance based on empirical city circuity factor (1.27x).
 */
export function calculateEstimatedRoadDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const straightLine = calculateStraightLineDistance(lat1, lon1, lat2, lon2);
  if (straightLine < 0.5) return straightLine;
  const estimatedRoad = straightLine * 1.25;
  return Math.round(estimatedRoad * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export const POPULAR_LOCATIONS: { name: string; state: string; lat: number; lng: number }[] = [
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
];
