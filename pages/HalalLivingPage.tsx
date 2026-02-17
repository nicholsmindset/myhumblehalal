
import React from 'react';
import { BLOG_POSTS } from '../constants';

const HalalLivingPage: React.FC = () => {
    const featuredPost = BLOG_POSTS[0];
    const otherPosts = BLOG_POSTS.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            <header className="space-y-4 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Halal Living</h1>
                <p className="text-xl text-gray-500">Your essential guide to the Halal lifestyle in Singapore. Discover food, travel, and business insights curated for the modern Muslim.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Hero Feature */}
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

                    {/* Posts Grid */}
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

                    <div className="flex justify-center gap-2 pt-8">
                        <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">Previous</button>
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${p === 1 ? 'bg-primary text-charcoal shadow-lg' : 'bg-white border hover:bg-gray-50'}`}>{p}</button>
                        ))}
                        <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-charcoal">Next</button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-12">
                    <div className="bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-black">Search Articles</h3>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input type="text" placeholder="e.g. Halal Ramen..." className="w-full pl-12 py-4 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl text-sm" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-black">Categories</h3>
                        <div className="space-y-2">
                            {[
                                { name: 'Halal Dining', count: 24 },
                                { name: 'Travel Guides', count: 12 },
                                { name: 'Islamic Finance', count: 8 },
                                { name: 'Business Spotlight', count: 15 },
                                { name: 'Events & Community', count: 5 }
                            ].map(cat => (
                                <button key={cat.name} className="w-full flex justify-between items-center py-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                                    <span>{cat.name}</span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-400">{cat.count}</span>
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
                            {[
                                { title: 'Best Nasi Padang in Tampines', date: 'May 14, 2024', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100' },
                                { title: 'Ramadan Bazaar Highlights 2024', date: 'April 02, 2024', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=100' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <img src={item.img} className="w-20 h-20 rounded-2xl object-cover shrink-0" alt={item.title} />
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
