import { useEffect, useRef } from 'react';

type MapPickerProps = {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
    defaultCenter?: [number, number];
    zoom?: number;
};

export function MapPicker({
    lat,
    lng,
    onChange,
    defaultCenter = [-7.4267, 109.3619],
    zoom = 14,
}: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) {
return;
}

        import('leaflet').then((L) => {
            const initLat = lat ?? defaultCenter[0];
            const initLng = lng ?? defaultCenter[1];

            const map = L.default.map(mapRef.current!, {
                center: [initLat, initLng],
                zoom,
            });

            L.default
                .tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '© OpenStreetMap',
                    },
                )
                .addTo(map);

            const marker = L.default
                .marker([initLat, initLng], { draggable: true })
                .addTo(map);

            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                onChange(
                    parseFloat(pos.lat.toFixed(8)),
                    parseFloat(pos.lng.toFixed(8)),
                );
            });

            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat: clickLat, lng: clickLng } = e.latlng;
                marker.setLatLng([clickLat, clickLng]);
                onChange(
                    parseFloat(clickLat.toFixed(8)),
                    parseFloat(clickLng.toFixed(8)),
                );
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;
        });

        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!markerRef.current || lat === null || lng === null) {
return;
}

        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current?.panTo([lat, lng]);
    }, [lat, lng]);

    return (
        <div className="overflow-hidden rounded-xl border border-[oklch(0.22_0.01_85/8%)]">
            <div ref={mapRef} className="h-72 w-full" />
        </div>
    );
}
