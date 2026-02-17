
import React from 'react';
import { MOCK_BUSINESSES } from '../constants';
import { Link } from 'react-router-dom';

const DirectoryMapView: React.FC = () => {
    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-white">
            {/* Floating Filter Header */}
            <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex flex-wrap items-center gap-6 z-30 shadow-sm">
                <div className="flex-1 flex items-center gap-4 min-w-[300px]">
                    <div className="bg-gray-50 rounded-2xl flex items-center px-6 gap-3 flex-grow border-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-gray-300">search</span>
                        <input type="text" placeholder="Nasi Lemak" className="w-full bg-transparent border-0 focus:ring-0 py-3.5 text-sm font-bold placeholder:text-gray-300" />
                    </div>
                    <div className="bg-gray-50 rounded-2xl flex items-center px-6 gap-3 flex-grow border-2 border-transparent focus-within:border-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-gray-300">location_on</span>
                        <input type="text" placeholder="Singapore" className="w-full bg-transparent border-0 focus:ring-0 py-3.5 text-sm font-bold placeholder:text-gray-300" />
                    </div>
                </div>
                
                <button className="bg-primary text-charcoal px-10 py-3.5 rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">Search</button>
                
                <div className="h-10 w-px bg-gray-100 mx-2 hidden lg:block" />
                
                <nav className="flex items-center gap-8">
                    {['Explore', 'Saved', 'Login'].map(link => (
                        <button key={link} className="text-xs font-black uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition-colors">{link}</button>
                    ))}
                    <button className="bg-primary text-charcoal px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-lg">add</span> Add Listing
                    </button>
                </nav>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Scrollable Results Pane */}
                <aside className="w-full md:w-[450px] lg:w-[550px] flex-shrink-0 bg-offwhite overflow-y-auto p-10 space-y-10 border-r border-gray-100 custom-scrollbar">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center text-[10px] font-black uppercase text-gray-400 gap-2 tracking-widest">
                            <span>Home</span>
                            <span>/</span>
                            <span>Singapore</span>
                            <span>/</span>
                            <span className="text-charcoal">Restaurants</span>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tight leading-tight">Halal Food <br /> in Singapore</h2>
                            <div className="flex items-center justify-between pt-2">
                                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">24 Results found</span>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-all shadow-sm">
                                        <span className="material-symbols-outlined">filter_list</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Inline Filter Chips */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {['Recommended', 'Price', 'Rating', 'Open Now', 'Cuisine Type'].map(f => (
                                <button key={f} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${f === 'Recommended' ? 'bg-primary/5 border-primary text-charcoal' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                    {f} <span className="material-symbols-outlined text-sm ml-1 inline-block align-middle">expand_more</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {MOCK_BUSINESSES.map(biz => (
                            <Link to={`/business/${biz.id}`} key={biz.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col">
                                <div className="h-64 relative overflow-hidden">
                                    <img src={biz.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={biz.name} />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-white/95 backdrop-blur-sm text-charcoal text-[11px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <span className="material-symbols-outlined text-accent text-lg filled">star</span> {biz.rating} <span className="text-gray-400 font-bold ml-1">({biz.reviewCount})</span>
                                        </span>
                                    </div>
                                    <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-charcoal shadow-lg hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-2xl">favorite</span>
                                    </button>
                                </div>
                                <div className="p-8 space-y-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{biz.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">Malay Cuisine • $$</p>
                                        </div>
                                        <span className="bg-primary text-charcoal text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-sm">{biz.id === "2" ? 'MUSLIM OWNED' : 'HALAL CERTIFIED'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-6">
                                            <span className={`flex items-center gap-1.5 ${biz.id === "2" ? 'text-red-500' : 'text-primary'}`}>
                                                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${biz.id === "2" ? 'bg-red-500' : 'bg-primary'}`} /> 
                                                {biz.id === "2" ? 'Closed' : 'Open Now'}
                                            </span>
                                            <span className="text-gray-300">• Closes 10 PM</span>
                                        </div>
                                        <span className="text-gray-300 flex items-center gap-1.5"><span className="material-symbols-outlined text-base">near_me</span> 0.8 km</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] font-black text-sm text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest">
                        Load more results <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
                    </button>
                </aside>

                {/* Map Interface Pane */}
                <main className="flex-grow relative bg-[#e5e7eb] hidden md:block">
                    {/* Placeholder for Interactive Map */}
                    <img 
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover opacity-50 grayscale-[0.5]" 
                        alt="Background Map Texture" 
                    />
                    <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
                    
                    {/* Active Floating Search Control */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                        <button className="bg-white px-8 py-4 rounded-full shadow-2xl font-black text-sm flex items-center gap-3 hover:bg-gray-50 transition-all border border-gray-100 uppercase tracking-widest active:scale-95">
                            <span className="material-symbols-outlined text-primary text-xl font-black">refresh</span> Search this area
                        </button>
                    </div>

                    {/* Mock Map Markers with Pin Design */}
                    {[
                        { t: '25%', l: '35%', p: '4.9', active: false },
                        { t: '48%', l: '58%', p: '4.5', active: true },
                        { t: '65%', l: '42%', p: '4.2', active: false }
                    ].map((marker, i) => (
                        <div key={i} className={`absolute transition-all transform -translate-x-1/2 -translate-y-full cursor-pointer group z-10 ${marker.active ? 'z-20' : ''}`} style={{ top: marker.t, left: marker.l }}>
                            <div className={`relative px-4 py-2.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center gap-2 ${marker.active ? 'bg-primary scale-125' : 'bg-white hover:bg-gray-50'}`}>
                                <span className={`material-symbols-outlined text-sm filled ${marker.active ? 'text-charcoal' : 'text-accent'}`}>star</span>
                                <span className={`font-black text-xs ${marker.active ? 'text-charcoal' : 'text-charcoal'}`}>{marker.p}</span>
                                {/* Pin Tail */}
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] ${marker.active ? 'border-t-primary' : 'border-t-white'}`} />
                            </div>
                        </div>
                    ))}

                    {/* Controls */}
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                         <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-charcoal hover:bg-gray-50 transition-all border border-gray-100">
                            <span className="material-symbols-outlined text-2xl">my_location</span>
                        </button>
                        <div className="bg-white rounded-2xl shadow-2xl flex flex-col divide-y border border-gray-100 overflow-hidden">
                            <button className="w-14 h-14 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-all">
                                <span className="material-symbols-outlined text-2xl">add</span>
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-all">
                                <span className="material-symbols-outlined text-2xl">remove</span>
                            </button>
                        </div>
                    </div>

                    {/* Compass Overlay */}
                    <div className="absolute top-8 right-10 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100">
                        <span className="material-symbols-outlined text-gray-300">explore</span>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DirectoryMapView;
