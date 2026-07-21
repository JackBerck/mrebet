import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface Props {
    latitude: number;
    longitude: number;
    title: string;
}

export default function DestinationMap({ latitude, longitude, title }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<LeafletMap | null>(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined' || !mapRef.current) return;

        let L: typeof import('leaflet');
        let isMounted = true;

        const initMap = async () => {
            // Dynamically import leaflet to prevent SSR issues
            L = (await import('leaflet')).default;
            if (!isMounted) return;

            // Import leaflet CSS
            await import('leaflet/dist/leaflet.css');

            // Set up default icon paths
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize map if not already done
            if (!mapInstance.current && mapRef.current) {
                mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(mapInstance.current);

                L.marker([latitude, longitude])
                    .addTo(mapInstance.current)
                    .bindPopup(`<b>${title}</b>`)
                    .openPopup();
            } else if (mapInstance.current) {
                // Just update view if already initialized
                mapInstance.current.setView([latitude, longitude], 15);
                
                // Clear existing markers
                mapInstance.current.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        mapInstance.current?.removeLayer(layer);
                    }
                });

                // Add new marker
                L.marker([latitude, longitude])
                    .addTo(mapInstance.current)
                    .bindPopup(`<b>${title}</b>`)
                    .openPopup();
            }
        };

        initMap();

        return () => {
            isMounted = false;
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [latitude, longitude, title]);

    return (
        <div className="w-full h-full min-h-75 rounded-xl overflow-hidden border border-(--line) z-0 relative">
            <div ref={mapRef} className="absolute inset-0 z-0" />
        </div>
    );
}
