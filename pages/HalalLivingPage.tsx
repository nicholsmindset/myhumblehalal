
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { blogs } from '../services/db';

const CATEGORIES = [
    'Dining Spotlight',
    'Lifestyle',
    'Business',
    'Travel',
];

const HalalLivingPage: React.FC = () => {
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const LIMIT = 4;

    useEffect(() => {
        const fetchPosts = async () => {
            const category = selectedCategory === 'All' ? undefined : selectedCategory;
            const res = await blogs.list({ category, page: 1, limit: 100 });
            let filtered = res.data;
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q)
                );
            }
            setAllPosts(filtered);
            setTotalPages(Math.ceil(filtered.length / LIMIT) || 1);
            setCurrentPage(1);
        };
        fetchPosts();
    }, [selectedCategory, searchQuery]);

    const paginatedPosts = allPosts.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);
    const featuredPost = paginatedPosts[0];
    const otherPosts = paginatedPosts.slice(1);

    const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
        acc[cat] = allPosts.filter(p => p.category === cat).length;
        return acc;
    }, {});

    // For the "all" view, count from unfiltered data
    const [totalCategoryCounts, setTotalCategoryCounts] = useState<Record<string, number>>({});
    useEffect(() => {
        const fetchCounts = async () => {
            const all = await blogs.list({ limit: 100 });
            const counts: Record<string, number> = {};
            CATEGORIES.forEach(cat => {
                counts[cat] = all.data.filter(p => p.category === cat).length;
            });
            setTotalCategoryCounts(counts);
        };
        fetchCounts();
    }, []);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            <header className="space-y-4 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Halal Living</h1>
                <p className="text-xl text-gray-500">Your essential guide to the Halal lifestyle in Singapore. Discover food, travel, and business insights curated for the modern Muslim.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Hero Feature */}
                    {featuredPost && (
                        <div className="relative group overflow-hidden rounded-[2.5rem] h-[500px] shadow-2xl">
                            <img src={featuredPost.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={featuredPost.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10 space-y-4">
                                <span className="bg-primary text-charcoal px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{featuredPost.category}</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">{featuredPost.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {featuredPost.date}</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> {featuredPost.author}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posts Grid */}
                    {otherPosts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {otherPosts.map(post => (
                                <div key={post.id} className="space-y-6 group cursor-pointer">
                                    <div className="aspect-[16/10] overflow-hidden rounded-3xl relative">
                                        <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={post.title} />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-black px-3 py-1 rounded-full uppercase">{post.category}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 px-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</p>
                                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                                        <button className="text-primary text-sm font-black flex items-center gap-2 pt-2">
                                            Read Full Story <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {paginatedPosts.length === 0 && (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-gray-300">article</span>
                            <p className="text-gray-400 mt-4 text-lg">No articles found.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-charcoal hover:bg-gray-200'}`}
                            >
                                Previous
                            </button>
                            {pageNumbers.map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${p === currentPage ? 'bg-primary text-charcoal shadow-lg' : 'bg-white border hover:bg-gray-50'}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-charcoal hover:bg-gray-200'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-12">
                    <div className="bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-black">Search Articles</h3>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g. Halal Ramen..."
                                className="w-full pl-12 py-4 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-black">Categories</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleCategoryClick('All')}
                                className={`w-full flex justify-between items-center py-2 text-sm font-bold transition-colors ${selectedCategory === 'All' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                            >
                                <span>All</span>
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-400">{allPosts.length}</span>
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`w-full flex justify-between items-center py-2 text-sm font-bold transition-colors ${selectedCategory === cat ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    <span>{cat}</span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-400">{totalCategoryCounts[cat] || 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0b241c] text-white rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-charcoal">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-black">Join Our Community</h3>
                            <p className="text-xs text-gray-400">Get the latest Halal news, dining reviews, and event invites delivered to your inbox.</p>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <input type="email" placeholder="Your email address" className="w-full bg-white/5 border-0 focus:ring-1 ring-primary py-4 rounded-xl text-sm" />
                            <button className="w-full bg-primary text-charcoal font-black py-4 rounded-xl shadow-lg hover:opacity-90 transition-all">Subscribe</button>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center">No spam, unsubscribe anytime.</p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">trending_up</span> Trending Now
                        </h3>
                        <div className="space-y-4">
                            {allPosts.slice(0, 2).map((item, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt={item.title} />
                                    <div className="space-y-1 py-1">
                                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HalalLivingPage;
