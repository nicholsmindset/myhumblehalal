
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businesses } from '../services/db';
import { Business } from '../types';

const DirectoryMapView: React.FC = () => {
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [selected, setSelected] = useState<Business | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-96 bg-white dark:bg-charcoal border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight dark:text-white">Map View</h2>
                        <Link to="/directory" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">List View</Link>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search businesses..."
                            className="w-full pl-10 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-bold dark:text-white"
                        />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filtered.length} businesses found</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map(biz => (
                        <Link
                            to={`/business/${biz.id}`}
                            key={biz.id}
                            onMouseEnter={() => setSelected(biz)}
                            onMouseLeave={() => setSelected(null)}
                            className={`flex items-center gap-4 p-5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all ${selected?.id === biz.id ? 'bg-primary/5' : ''}`}
                        >
                            <img src={biz.imageUrl} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={biz.name} />
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm truncate dark:text-white">{biz.name}</h3>
                                    {biz.isVerified && <span className="material-symbols-outlined text-primary text-sm filled">verified</span>}
                                </div>
                                <div className="flex items-center gap-1 text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined text-xs ${i < Math.floor(biz.rating) ? 'filled' : ''}`}>star</span>
                                    ))}
                                    <span className="text-[10px] text-gray-400 ml-1">({biz.reviewCount})</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{biz.address}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6 px-8">
                        <div className="w-20 h-20 bg-white dark:bg-charcoal rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                            <span className="material-symbols-outlined text-primary text-4xl">map</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black dark:text-white">Interactive Map</h3>
                            <p className="text-gray-400 font-medium max-w-md">Map integration with Google Maps or Leaflet will be connected here. {mapBusinesses.length} businesses have geocoded locations ready.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {mapBusinesses.slice(0, 5).map(b => (
                                <span key={b.id} className="px-3 py-1.5 bg-white dark:bg-charcoal rounded-full text-xs font-bold border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-xs align-middle mr-1">location_on</span>
                                    {b.name}
                                </span>
                            ))}
                            {mapBusinesses.length > 5 && (
                                <span className="px-3 py-1.5 bg-primary/10 rounded-full text-xs font-black text-primary">
                                    +{mapBusinesses.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectoryMapView;
