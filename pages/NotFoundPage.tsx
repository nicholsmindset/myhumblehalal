
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col relative overflow-hidden bg-[#fafffd]">
            {/* Ambient Background UI Elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[900px] h-[900px] border border-primary/10 rounded-full opacity-50" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[650px] h-[650px] border border-primary/10 rounded-full opacity-40" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full opacity-30" />
            
            <div className="flex-grow flex items-center justify-center max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center w-full">
                    {/* Visual Section - Circular Map Graphic */}
                    <div className="flex justify-center order-2 lg:order-1">
                        <div className="relative w-full max-w-lg aspect-square">
                            <div className="absolute inset-0 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                                {/* Dotted Grid Background */}
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
                                
                                <div className="relative z-10">
                                    <div className="w-40 h-40 md:w-56 md:h-56 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-primary/30 animate-bounce duration-[2500ms] ease-in-out relative">
                                        <span className="material-symbols-outlined text-7xl md:text-9xl text-charcoal">location_on</span>
                                        {/* Error Marker Overlay */}
                                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-50">
                                            <span className="material-symbols-outlined text-red-500 text-4xl font-black">close</span>
                                        </div>
                                    </div>
                                    {/* Grounding Shadow */}
                                    <div className="mt-16 w-32 h-6 bg-charcoal/10 rounded-[100%] blur-xl mx-auto animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12 text-center lg:text-left order-1 lg:order-2">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-primary text-xl font-black uppercase tracking-[0.5em] animate-pulse">ERROR 404</p>
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-charcoal">Location <br /> Not Found</h1>
                            </div>
                            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-xl font-medium">
                                We've searched our entire directory, but the page you are looking for seems to have moved or doesn't exist.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/" className="px-12 py-6 bg-primary text-charcoal rounded-[1.5rem] font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-widest whitespace-nowrap">
                                Return Home
                            </Link>
                            <div className="relative flex-grow max-w-md group">
                                <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Search Directory" 
                                    className="w-full pl-20 pr-8 py-6 bg-white border-0 rounded-[1.5rem] shadow-xl focus:ring-2 ring-primary text-base font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-100 flex items-center justify-center lg:justify-start gap-2">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Need help?
                            </p>
                            <Link to="/support" className="text-sm font-black text-charcoal underline hover:text-primary transition-all tracking-widest">Contact Support</Link>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 border-t border-gray-100 px-8 bg-white/50 backdrop-blur-sm relative z-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">&copy; {new Date().getFullYear()} Humble Halal. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-10">
                        {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
                            <Link key={l} to="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-charcoal transition-colors tracking-widest">{l}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NotFoundPage;
