
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { businesses } from '../services/db';
import { CATEGORY_IMAGES } from '../services/seed-data';

const CATEGORY_ICONS: Record<string, string> = {
    [Category.FOOD]: 'restaurant',
    [Category.RETAIL]: 'storefront',
    [Category.HEALTH]: 'spa',
    [Category.PROFESSIONAL]: 'work',
    [Category.EDUCATION]: 'school',
    [Category.TRAVEL]: 'flight',
    [Category.BEAUTY]: 'face',
    [Category.HOME]: 'cleaning_services',
};

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
        img: CATEGORY_IMAGES[name],
        icon: CATEGORY_ICONS[name] || 'store',
        listings: counts[name] !== undefined ? counts[name] : -1,
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-charcoal dark:text-white">Explore Categories</h1>
                <p className="text-lg text-gray-500">Discover certified and Muslim-owned businesses across Singapore.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map(cat => (
                    <Link to={`/directory?category=${cat.name}`} key={cat.name} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all">
                        <div className="aspect-[4/3] overflow-hidden relative">
                            <img src={cat.img} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={cat.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-xl">{cat.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">{cat.name}</h3>
                                    <p className="text-white/80 text-xs font-medium">
                                        {cat.listings === -1 ? 'Loading...' : `${cat.listings} listing${cat.listings !== 1 ? 's' : ''}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryExplorerPage;
