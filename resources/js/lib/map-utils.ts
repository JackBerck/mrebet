export interface MapLocation {
    name?: string;
    address?: string | null;
    gmaps_link?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

/**
 * Returns a clean, working Google Maps embed iframe URL.
 * Prioritizes exact coordinates (latitude & longitude) if present.
 */
export function getGoogleMapsEmbedUrl(location: MapLocation): string {
    if (location.latitude && location.longitude) {
        return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
    }

    if (!location.gmaps_link) return '';

    const coordMatch = location.gmaps_link.match(/[-+]?\d+\.\d+,\s*[-+]?\d+\.\d+/);
    if (coordMatch) {
        return `https://maps.google.com/maps?q=${coordMatch[0]}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
    }

    const query = `${location.name ?? ''} ${location.address ?? 'Desa Serayu Larangan Purbalingga'}`.trim();
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
}
