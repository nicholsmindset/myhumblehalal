
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { businesses } from '../services/db';

const IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDup71s2VVfXxtDvX_tz2dgI1cgXEzdCfWqmcB5OUDCf5XiuS_D65zLm2CV6eIFRXtNX0ARqRTs_qD1E43ZVL06qZikpqxfH_iAyT-hO3kfygelIZJHVUTFYgSeeD7CtHFL5NJSs5KsgLEMlqGIf64FX_m42lWnfvg1MjqTcfRVXp4UrWYwAMd-AbGeyOUOarN2uAkwI6nIDv_C1fBKUOI0X3BAogA4ctzDA2TKgQZU2bzHPVriPiSDRu59NupzwPR2EOUoHACdtvg";

const CategoryExplorerPage: React.FC = () => {
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadCounts = async () => {
            const result: Record<string, number> = {};
            for (const cat of Object.values(Category)) {
                const { total } = await businesses.list({ category: cat, limit: 1 });
                result[cat] = total;
            }
            setCounts(result);
        };
        loadCounts();
    }, []);

    const categories = Object.values(Category).map(name => ({
        name,
        img: IMG,
        listings: counts[name] !== undefined ? `${counts[name]} listing${counts[name] !== 1 ? 's' : ''}` : 'Loading...',
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center md:text-left space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Explore Halal Business Categories</h1>
                <p className="text-lg text-gray-500">Discover a wide range of certified and Muslim-owned businesses in Singapore.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map(cat => (
                    <Link to={`/directory?category=${cat.name}`} key={cat.name} className="bg-white dark:bg-charcoal/20 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all group flex flex-col gap-4">
                        <div className="aspect-video rounded-2xl overflow-hidden relative">
                            <img src={cat.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={cat.name} />
                        </div>
                        <div className="px-2 pb-2">
                            <h3 className="text-xl font-bold">{cat.name}</h3>
                            <p className="text-xs text-primary font-bold mt-1">{cat.listings}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryExplorerPage;
