// Utility to geocode specific location strings using OpenStreetMap Nominatim API
// and project them to % coordinates for the Equirectangular world map image.

export async function geocodeLocation(location) {
    if (!location) return null;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
            headers: {
                'User-Agent': 'HumanCRM/1.0' // Required by Nominatim
            }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return projectCoordinates(parseFloat(lat), parseFloat(lon));
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return null;
}

// Projects Lat/Lon to X/Y percentages for a Mercator projection
// Valid for latitudes approx -85 to 85.
function projectCoordinates(lat, lon) {
    const MAX_LAT = 85.0511;

    // Clamp latitude
    let clampedLat = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));

    // X: Longitude is linear
    // -180 (left) -> 0%, 180 (right) -> 100%
    const x = ((lon + 180) / 360) * 100;

    // Y: Mercator projection
    // Convert to radians
    const latRad = (clampedLat * Math.PI) / 180;

    // Mercator formula: ln(tan(pi/4 + lat/2))
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));

    // Map mercN from [-PI, PI] (roughly) to [0, 1]
    // The "height" of the Mercator world in these units is 2*PI? No.
    // Standard Web Mercator: y = 0.5 - (mercN / (2 * PI)) is 0 to 1?
    // Let's verify: at lat=0, mercN=0. y=0.5 (center).
    // at lat=85.05, mercN ~ PI. y = 0.5 - 0.5 = 0 (top).
    // at lat=-85.05, mercN ~ -PI. y = 0.5 + 0.5 = 1 (bottom).
    const y = (0.5 - (mercN / (2 * Math.PI))) * 100;

    return { x, y };
}
