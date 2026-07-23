import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { Layers, X } from 'lucide-react';

export interface MapPoint {
    id: number;
    type: 'destination' | 'village';
    name: string;
    slug: string;
    category?: string;
    category_label?: string;
    ticket_price?: number;
    ticket_info?: string | null;
    open_time?: string | null;
    close_time?: string | null;
    latitude: number;
    longitude: number;
    village_name?: string;
    destinations_count?: number;
    primary_media?: { file_path: string } | null;
}

interface Props {
    items: MapPoint[];
    selectedItem: MapPoint | null;
    onSelectItem: (item: MapPoint | null) => void;
}

export default function InteractiveMap({ items, selectedItem, onSelectItem }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<LeafletMap | null>(null);
    const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
    const [legendOpen, setLegendOpen] = useState(false);

    // Initial default center: Mrebet / Purbalingga (~ -7.3195, 109.3468)
    const defaultLat = -7.3195;
    const defaultLng = 109.3468;

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

        let L: typeof import('leaflet');
        let isMounted = true;

        const initMap = async () => {
            L = (await import('leaflet')).default;
            if (!isMounted) return;

            // Fix marker icon issue in Leaflet with bundlers
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize map if needed
            if (!mapInstance.current && mapRef.current) {
                const instance = L.map(mapRef.current, {
                    zoomControl: false,
                }).setView([defaultLat, defaultLng], 12);

                // Add zoom control top right
                L.control.zoom({ position: 'topright' }).addTo(instance);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 18,
                }).addTo(instance);

                mapInstance.current = instance;
            }

            const map = mapInstance.current;
            if (!map) return;

            // Force recalculate container size
            setTimeout(() => {
                map.invalidateSize();
            }, 100);

            // Clear old markers
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current.clear();

            if (items.length === 0) return;

            const bounds = L.latLngBounds([]);

            items.forEach((item) => {
                const markerKey = `${item.type}-${item.id}`;
                bounds.extend([item.latitude, item.longitude]);

                // Determine marker color and icon symbol based on type/category
                let bgColor = '#15803d'; // Default forest green
                let iconSymbol = '🌲';

                if (item.type === 'village') {
                    bgColor = '#c2410c'; // Orange-brown for village
                    iconSymbol = '🏡';
                } else if (item.category === 'budaya') {
                    bgColor = '#b45309'; // Gold for culture
                    iconSymbol = '🏛️';
                } else if (item.category === 'buatan') {
                    bgColor = '#0284c7'; // Blue for artificial
                    iconSymbol = '🎡';
                }

                // Custom DivIcon for modern styled pin
                const customIcon = L.divIcon({
                    className: 'custom-map-pin',
                    html: `
                        <div style="
                            background-color: ${bgColor};
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 16px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            border: 2px solid white;
                            cursor: pointer;
                            transition: transform 0.2s ease;
                        " class="marker-pin-inner">
                            ${iconSymbol}
                        </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18],
                    popupAnchor: [0, -18],
                });

                // Create popup HTML
                const imageHtml = item.primary_media 
                    ? `<img src="/storage/${item.primary_media.file_path}" alt="${item.name}" style="width:100%; height:120px; object-fit:cover; border-radius: 8px 8px 0 0;" />`
                    : `<div style="width:100%; height:75px; background:#e5e7eb; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:12px; border-radius: 8px 8px 0 0;">Tanpa Foto</div>`;

                const subtext = item.type === 'destination' 
                    ? `<span style="font-size:11px; background:#f3f4f6; color:#374151; padding:2px 6px; border-radius:4px; font-weight:600;">${item.category_label || 'Wisata'}</span>`
                    : `<span style="font-size:11px; background:#ffedd5; color:#c2410c; padding:2px 6px; border-radius:4px; font-weight:600;">Desa Wisata</span>`;

                const priceOrCount = item.type === 'destination'
                    ? (item.ticket_price && item.ticket_price > 0 
                        ? `Rp ${item.ticket_price.toLocaleString('id-ID')}` 
                        : 'Gratis')
                    : `${item.destinations_count || 0} Destinasi Wisata`;

                const detailUrl = item.type === 'destination' ? `/destinasi/${item.slug}` : `/desa/${item.slug}`;

                const popupContent = `
                    <div style="width: 220px; font-family: sans-serif; text-align: left; border-radius:8px; overflow:hidden;">
                        ${imageHtml}
                        <div style="padding: 10px 12px;">
                            <div style="margin-bottom: 6px;">${subtext}</div>
                            <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #111827; line-height: 1.2;">${item.name}</h4>
                            <p style="font-size: 12px; color: #6b7280; margin: 0 0 10px 0; font-weight: 500;">${priceOrCount}</p>
                            <a href="${detailUrl}" style="
                                display: block; 
                                width: 100%; 
                                text-align: center; 
                                background: #15803d; 
                                color: white; 
                                padding: 6px 0; 
                                border-radius: 6px; 
                                font-size: 12px; 
                                font-weight: 600; 
                                text-decoration: none;
                            ">Lihat Detail &rarr;</a>
                        </div>
                    </div>
                `;

                const marker = L.marker([item.latitude, item.longitude], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(popupContent, { maxWidth: 240, className: 'custom-leaflet-popup' });

                marker.on('click', () => {
                    onSelectItem(item);
                });

                markersRef.current.set(markerKey, marker);
            });

            // Fit bounds if items present and no item explicitly selected
            if (items.length > 0 && !selectedItem && bounds.isValid()) {
                map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
            }
        };

        initMap();

        return () => {
            isMounted = false;
        };
    }, [items]);

    // Handle center zoom when selectedItem changes
    useEffect(() => {
        if (!selectedItem || !mapInstance.current) return;

        const map = mapInstance.current;
        map.invalidateSize();
        map.flyTo([selectedItem.latitude, selectedItem.longitude], 15, {
            duration: 1.2,
        });

        const markerKey = `${selectedItem.type}-${selectedItem.id}`;
        const marker = markersRef.current.get(markerKey);
        if (marker) {
            setTimeout(() => {
                marker.openPopup();
            }, 600);
        }
    }, [selectedItem]);

    return (
        <div className="w-full h-[500px] lg:h-[620px] rounded-2xl overflow-hidden border border-(--line) relative shadow-sm bg-neutral-100">
            {/* Map Container directly with w-full h-full */}
            <div ref={mapRef} className="w-full h-full z-0" />

            {/* Floating Legend Widget (Collapsible) */}
            <div className="absolute top-4 left-4 z-10">
                {legendOpen ? (
                    <div className="bg-white/95 backdrop-blur border border-(--line) rounded-2xl p-4 shadow-lg w-60 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-3 border-b border-(--line) pb-2">
                            <span className="font-display font-bold text-xs uppercase tracking-wider text-(--forest-deep) flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-(--forest)" />
                                Legenda Peta
                            </span>
                            <button 
                                onClick={() => setLegendOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Tutup legenda"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-2.5 text-xs text-(--charcoal)">
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#15803d] text-white flex items-center justify-center text-xs shrink-0 shadow-sm">🌲</span>
                                <span className="font-medium">Wisata Alam</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#b45309] text-white flex items-center justify-center text-xs shrink-0 shadow-sm">🏛️</span>
                                <span className="font-medium">Wisata Budaya & Religi</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs shrink-0 shadow-sm">🎡</span>
                                <span className="font-medium">Wisata Buatan</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-xs shrink-0 shadow-sm">🏡</span>
                                <span className="font-medium">Desa Wisata</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setLegendOpen(true)}
                        className="bg-white/90 backdrop-blur border border-(--line) text-(--forest-deep) font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:bg-white hover:text-(--forest) transition-all"
                    >
                        <Layers className="w-4 h-4 text-(--forest)" />
                        Legenda Peta
                    </button>
                )}
            </div>
        </div>
    );
}
