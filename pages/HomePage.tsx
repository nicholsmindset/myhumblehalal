
import React from 'react';
import { Link } from 'react-router-dom';
import { Region } from '../types';

const HomePage: React.FC = () => {
    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1525625232717-1c28c31a6132?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover brightness-[0.5]"
                        alt="Singapore Skyline"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4 space-y-8 w-full max-w-5xl">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">Your Guide to Halal in Singapore</h1>
                    <p className="text-lg md:text-2xl font-medium max-w-3xl mx-auto opacity-90">Discover certified Halal eateries, services, and shops near you.</p>
                    
                    <div className="bg-white rounded-md p-1.5 shadow-2xl flex flex-col md:flex-row max-w-4xl mx-auto items-center overflow-hidden">
                        <div className="flex items-center px-6 gap-2 border-b md:border-b-0 md:border-r border-gray-100 min-w-[180px]">
                            <select className="bg-transparent border-0 focus:ring-0 py-4 text-sm font-bold text-gray-500 w-full cursor-pointer">
                                <option>All Categories</option>
                                <option>Food & Beverage</option>
                                <option>Retail</option>
                                <option>Services</option>
                            </select>
                        </div>
                        <div className="flex-grow flex items-center px-6">
                            <input 
                                type="text" 
                                placeholder="Search for a business or cuisine..." 
                                className="w-full border-0 focus:ring-0 text-charcoal py-4 text-sm font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <button className="bg-[#006A4E] text-white px-10 py-4 rounded-md font-bold hover:bg-[#005a3f] transition-all uppercase tracking-widest text-sm w-full md:w-auto">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Advertisement Bar */}
            <div className="bg-[#eaedee] py-10 flex justify-center items-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advertisement - 728x90</div>
            </div>

            {/* Explore by District */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
                <h2 className="text-4xl font-black text-center text-charcoal dark:text-white tracking-tighter">Explore by District</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Central Region", img: "https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80&w=800" },
                        { name: "East Region", img: "https://images.unsplash.com/photo-1563897539633-7374c276c212?auto=format&fit=crop&q=80&w=800" },
                        { name: "West Region", img: "https://images.unsplash.com/photo-1517248135467-4c7ed9d421bb?auto=format&fit=crop&q=80&w=800" },
                        { name: "North Region", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" }
                    ].map(region => (
                        <Link to={`/directory?region=${region.name}`} key={region.name} className="group relative h-64 rounded-xl overflow-hidden shadow-lg">
                            <img src={region.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={region.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <span className="text-white text-xl font-bold">{region.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Businesses */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
                <h2 className="text-4xl font-black text-center text-charcoal dark:text-white tracking-tighter">Featured Businesses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "The Cozy Corner Cafe", cat: "Cafe", loc: "Yishun", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" },
                        { name: "Makan Sedap", cat: "Restaurant", loc: "Tampines", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" },
                        { name: "Hijab Couture", cat: "Retail", loc: "Jurong East", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" },
                        { name: "Bake & Joy", cat: "Bakery", loc: "Bugis", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800" }
                    ].map(biz => (
                        <div key={biz.name} className="bg-white dark:bg-charcoal/30 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src={biz.img} className="w-full h-full object-cover" alt={biz.name} />
                            </div>
                            <div className="p-6 space-y-1">
                                <h3 className="font-bold text-lg dark:text-white">{biz.name}</h3>
                                <p className="text-sm text-gray-500">{biz.cat}</p>
                                <p className="text-xs text-gray-400">{biz.loc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-[#005a3f] py-24 text-center">
                <div className="max-w-4xl mx-auto px-4 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Stay in the Loop</h2>
                    <p className="text-white opacity-90 text-lg">Sign up for our newsletter to get the latest listings and exclusive deals delivered to your inbox.</p>
                    <div className="flex flex-col sm:row sm:flex-row gap-4 max-w-2xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white rounded-md border-0 text-charcoal px-6 py-4 w-full focus:ring-0"
                        />
                        <button type="submit" className="bg-[#13ec80] text-[#006A4E] px-10 py-4 rounded-md font-black hover:bg-[#00f37e] transition-all whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Newly Added */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
                <h2 className="text-4xl font-black text-center text-charcoal dark:text-white tracking-tighter">Newly Added</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Grill Master SG", cat: "Restaurant", date: "Added 1 day ago", icon: "restaurant" },
                        { name: "Sparkle Clean", cat: "Services", date: "Added 2 days ago", icon: "cleaning_services" },
                        { name: "Ramen Halal House", cat: "Restaurant", date: "Added 3 days ago", icon: "ramen_dining" }
                    ].map(item => (
                        <div key={item.name} className="bg-white dark:bg-charcoal/30 border border-gray-100 dark:border-gray-800 p-8 rounded-xl flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-lg dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.cat}</p>
                                <p className="text-xs text-gray-400">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
