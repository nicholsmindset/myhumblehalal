
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Business } from '../types';
import { businesses } from '../services/db';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
    const [newestBusinesses, setNewestBusinesses] = useState<Business[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('All Categories');

    useEffect(() => {
        businesses.list({ featured: true, limit: 4 }).then(res => setFeaturedBusinesses(res.data));
        businesses.list({ sort: 'newest', limit: 3 }).then(res => setNewestBusinesses(res.data));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        if (searchCategory && searchCategory !== 'All Categories') params.set('category', searchCategory);
        navigate(`/directory?${params.toString()}`);
    };

    const formatTimeAgo = (dateStr?: string) => {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Added today';
        if (diffDays === 1) return 'Added 1 day ago';
        if (diffDays < 30) return `Added ${diffDays} days ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths === 1) return 'Added 1 month ago';
        return `Added ${diffMonths} months ago`;
    };

    const getCategoryIcon = (category: string) => {
        if (category.includes('Food')) return 'restaurant';
        if (category.includes('Retail')) return 'storefront';
        if (category.includes('Health')) return 'spa';
        if (category.includes('Professional')) return 'work';
        if (category.includes('Education')) return 'school';
        if (category.includes('Travel')) return 'flight';
        if (category.includes('Beauty')) return 'face';
        if (category.includes('Home')) return 'cleaning_services';
        return 'store';
    };

    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1525625232717-1c28c31a6132?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-40"
                        alt="Singapore Skyline"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4 py-20 space-y-8 w-full max-w-4xl">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                            <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                            <span className="text-xs font-bold text-white/90">Trusted Halal Directory</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">Your Guide to<br /><span className="text-emerald-400">Halal in Singapore</span></h1>
                        <p className="text-base md:text-lg font-medium max-w-2xl mx-auto text-white/75">Discover certified Halal eateries, services, and shops near you.</p>
                    </div>

                    <form onSubmit={handleSearch} className="bg-white rounded-xl p-1.5 shadow-2xl flex flex-col md:flex-row max-w-3xl mx-auto items-center overflow-hidden">
                        <div className="flex items-center px-4 gap-2 border-b md:border-b-0 md:border-r border-gray-100 min-w-[160px]">
                            <select
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="bg-transparent border-0 focus:ring-0 py-3.5 text-sm font-semibold text-gray-500 w-full cursor-pointer"
                            >
                                <option>All Categories</option>
                                <option>Food & Beverage</option>
                                <option>Retail & Shopping</option>
                                <option>Health & Wellness</option>
                                <option>Professional Services</option>
                                <option>Education & Enrichment</option>
                                <option>Travel & Hospitality</option>
                                <option>Beauty & Personal Care</option>
                                <option>Home Services</option>
                            </select>
                        </div>
                        <div className="flex-grow flex items-center px-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a business or cuisine..."
                                className="w-full border-0 focus:ring-0 text-charcoal py-3.5 text-sm font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-700 transition-all text-sm w-full md:w-auto">
                            Search
                        </button>
                    </form>

                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        {['Nasi Lemak', 'Murtabak', 'Briyani', 'Halal Cafe'].map(tag => (
                            <Link key={tag} to={`/directory?search=${encodeURIComponent(tag)}`} className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-white/80 hover:text-white transition-colors">
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { num: '20+', label: 'Verified Businesses', icon: 'storefront' },
                            { num: '8', label: 'Categories', icon: 'category' },
                            { num: '6', label: 'Upcoming Events', icon: 'event' },
                            { num: '4', label: 'Regions Covered', icon: 'map' },
                        ].map(stat => (
                            <div key={stat.label} className="space-y-1">
                                <span className="material-symbols-outlined text-emerald-600 text-2xl">{stat.icon}</span>
                                <p className="text-2xl font-black text-charcoal dark:text-white">{stat.num}</p>
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore by District */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">Explore by District</h2>
                    <Link to="/map" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View Map <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Central Region", img: "https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80&w=800", count: "12 businesses" },
                        { name: "East Region", img: "https://images.unsplash.com/photo-1563897539633-7374c276c212?auto=format&fit=crop&q=80&w=800", count: "4 businesses" },
                        { name: "West Region", img: "https://images.unsplash.com/photo-1517248135467-4c7ed9d421bb?auto=format&fit=crop&q=80&w=800", count: "1 business" },
                        { name: "North Region", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800", count: "3 businesses" }
                    ].map(region => (
                        <Link to={`/directory?region=${encodeURIComponent(region.name)}`} key={region.name} className="group relative h-52 rounded-xl overflow-hidden">
                            <img src={region.img} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={region.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-white text-lg font-bold block">{region.name}</span>
                                <span className="text-white/70 text-xs font-medium">{region.count}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Businesses */}
            <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">Featured Businesses</h2>
                        <Link to="/directory" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {featuredBusinesses.map(biz => (
                            <Link to={`/business/${biz.slug ?? biz.id}`} key={biz.id} className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                                <div className="h-44 overflow-hidden">
                                    <img src={biz.imageUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={biz.name} />
                                </div>
                                <div className="p-5 space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-bold text-sm dark:text-white truncate">{biz.name}</h3>
                                        {biz.isVerified && <span className="material-symbols-outlined text-emerald-500 text-sm filled">verified</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">{biz.category}</p>
                                    <p className="text-xs text-gray-400 truncate">{biz.address}</p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <div className="flex text-amber-400 text-xs">
                                            {'★'.repeat(Math.round(biz.rating))}{'☆'.repeat(5 - Math.round(biz.rating))}
                                        </div>
                                        <span className="text-xs text-gray-400">({biz.reviewCount})</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-emerald-700 py-20 text-center">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Stay in the Loop</h2>
                    <p className="text-emerald-100 text-base">Get the latest listings and exclusive deals delivered to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white px-5 py-3.5 w-full focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder:text-white/50 text-sm"
                        />
                        <button type="submit" className="bg-white text-emerald-700 px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-50 transition-all whitespace-nowrap text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Newly Added */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">Newly Added</h2>
                    <Link to="/directory?sort=newest" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        See More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {newestBusinesses.map(item => (
                        <Link to={`/business/${item.slug ?? item.id}`} key={item.id} className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 p-6 rounded-xl flex items-center gap-5 hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-emerald-600 text-2xl">{getCategoryIcon(item.category)}</span>
                            </div>
                            <div className="space-y-1 min-w-0">
                                <h4 className="font-bold text-sm dark:text-white truncate">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.category}</p>
                                <p className="text-xs text-gray-400">{formatTimeAgo(item.submissionDate)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link to="/submit-business" className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-all group text-center space-y-3">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-emerald-100 transition-colors">
                                <span className="material-symbols-outlined text-emerald-600 text-2xl">add_business</span>
                            </div>
                            <h3 className="font-bold text-lg dark:text-white">List Your Business</h3>
                            <p className="text-sm text-gray-500">Get discovered by thousands of customers looking for Halal services.</p>
                        </Link>
                        <Link to="/events" className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-all group text-center space-y-3">
                            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-amber-100 transition-colors">
                                <span className="material-symbols-outlined text-amber-600 text-2xl">event</span>
                            </div>
                            <h3 className="font-bold text-lg dark:text-white">Upcoming Events</h3>
                            <p className="text-sm text-gray-500">Browse bazaars, food festivals, seminars, and community events.</p>
                        </Link>
                        <Link to="/living" className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl p-8 hover:shadow-lg transition-all group text-center space-y-3">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors">
                                <span className="material-symbols-outlined text-blue-600 text-2xl">auto_stories</span>
                            </div>
                            <h3 className="font-bold text-lg dark:text-white">Halal Living</h3>
                            <p className="text-sm text-gray-500">Read guides on dining, travel, fashion, and entrepreneurship.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
