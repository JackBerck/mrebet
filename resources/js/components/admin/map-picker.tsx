import { useEffect, useRef, useState } from 'react';
import { Locate, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
    const [isLocating, setIsLocating] = useState(false);

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

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Browser Anda tidak mendukung fitur lokasi GPS.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLat = parseFloat(
                    position.coords.latitude.toFixed(8),
                );
                const currentLng = parseFloat(
                    position.coords.longitude.toFixed(8),
                );

                onChange(currentLat, currentLng);

                if (markerRef.current && mapInstanceRef.current) {
                    markerRef.current.setLatLng([currentLat, currentLng]);
                    mapInstanceRef.current.setView([currentLat, currentLng], 16);
                }

                toast.success('Lokasi GPS terkini berhasil ditemukan!');
                setIsLocating(false);
            },
            (error) => {
                let msg = 'Gagal mengambil lokasi GPS.';
                if (error.code === error.PERMISSION_DENIED) {
                    msg = 'Izin akses lokasi GPS ditolak di browser.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    msg = 'Informasi lokasi GPS tidak tersedia saat ini.';
                } else if (error.code === error.TIMEOUT) {
                    msg = 'Waktu pencarian lokasi GPS habis.';
                }
                toast.error(msg);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-(--charcoal-soft)">
                    Klik peta atau geser pin lokasi untuk menentukan koordinat:
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLocating}
                    onClick={handleGetCurrentLocation}
                    className="h-8 gap-1.5 border-(--line) bg-white text-xs font-medium text-(--forest-deep) shadow-xs hover:bg-(--forest-mist) hover:text-(--forest-deep)"
                >
                    {isLocating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-(--forest)" />
                    ) : (
                        <Locate className="h-3.5 w-3.5 text-(--forest)" />
                    )}
                    {isLocating ? 'Mendeteksi GPS...' : 'Gunakan Lokasi Saya (GPS)'}
                </Button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-(--line)">
                <div ref={mapRef} className="h-72 w-full" />
            </div>
        </div>
    );
}
