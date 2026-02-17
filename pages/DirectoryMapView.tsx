
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { businesses } from '../services/db';
import { Business } from '../types';
import L from 'leaflet';

const DirectoryMapView: React.FC = () => {
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [selected, setSelected] = useState<Business | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await businesses.list({ limit: 50 });
            setAllBusinesses(data);
        };
        load();
    }, []);

    const filtered = allBusinesses.filter(b =>
        !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mapBusinesses = filtered.filter(b => b.lat && b.lng);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [1.3521, 103.8198],
            zoom: 12,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        const greenIcon = L.divIcon({
            html: '<div style="background:#059669;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>',
            className: '',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        mapBusinesses.forEach(biz => {
            if (!biz.lat || !biz.lng) return;
            const marker = L.marker([biz.lat, biz.lng], { icon: greenIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width:180px;font-family:system-ui">
                        <strong style="font-size:13px">${biz.name}</strong><br/>
                        <span style="color:#666;font-size:11px">${biz.category}</span><br/>
                        <span style="color:#999;font-size:11px">${biz.address}</span><br/>
                        <a href="#/business/${biz.id}" style="color:#059669;font-size:11px;font-weight:bold;text-decoration:none">View Details &rarr;</a>
                    </div>
                `);
            marker.on('click', () => setSelected(biz));
            markersRef.current.push(marker);
        });

        if (mapBusinesses.length > 0) {
            const bounds = L.latLngBounds(mapBusinesses.map(b => [b.lat!, b.lng!]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [mapBusinesses.length, filtered.length]);

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-96 bg-white dark:bg-charcoal border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black tracking-tight dark:text-white">Map View</h2>
                        <Link to="/directory" className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline">List View</Link>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search businesses..."
                            className="w-full pl-10 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-medium dark:text-white py-2.5"
                        />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{filtered.length} businesses found</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map(biz => (
                        <Link
                            to={`/business/${biz.id}`}
                            key={biz.id}
                            onMouseEnter={() => setSelected(biz)}
                            onMouseLeave={() => setSelected(null)}
                            className={`flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all ${selected?.id === biz.id ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                        >
                            <img src={biz.imageUrl} className="w-14 h-14 rounded-lg object-cover shrink-0" alt={biz.name} />
                            <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-sm truncate dark:text-white">{biz.name}</h3>
                                    {biz.isVerified && <span className="material-symbols-outlined text-emerald-500 text-xs filled">verified</span>}
                                </div>
                                <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                                    {'★'.repeat(Math.floor(biz.rating))}{'☆'.repeat(5 - Math.floor(biz.rating))}
                                    <span className="text-gray-400 ml-0.5">({biz.reviewCount})</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{biz.address}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <div ref={mapRef} className="absolute inset-0" />
            </div>
        </div>
    );
};

export default DirectoryMapView;
