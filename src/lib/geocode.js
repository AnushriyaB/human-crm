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
            return {
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            };
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return null;
}
