
type Coord = { lat: number, lon: number };
function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
};
export function haversine(query: [Coord, Coord]): number {
    const R = 6371;

    const φ1 = toRadians(query[0].lat);
    const φ2 = toRadians(query[1].lat);
    const Δφ = toRadians(query[1].lat - query[0].lat);
    const Δλ = toRadians(query[1].lon - query[0].lon);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}