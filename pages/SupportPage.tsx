
import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';

const SupportPage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="pb-24">
            {/* Hero Support */}
            <section className="relative h-[550px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover brightness-[0.25]" 
                        alt="Singapore CBD" 
                    />
                </div>
                <div className="relative z-10 text-center px-4 space-y-10 w-full max-w-4xl">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-[0.4em]">
                            <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                            <span>/</span>
                            <span className="text-primary">Help Center</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">How can we <br /> help you?</h1>
                        <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto">Search our knowledge base regarding business listings, certifications, and event organization.</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-2.5 shadow-2xl flex flex-col md:flex-row max-w-2xl mx-auto border border-white/10">
                        <div className="flex-1 flex items-center px-6 gap-3">
                            <span className="material-symbols-outlined text-gray-300">search</span>
                            <input 
                                type="text" 
                                placeholder="Search for answers (e.g. 'How to update halal cert')" 
                                className="w-full border-0 focus:ring-0 text-charcoal bg-transparent py-4 text-sm font-bold placeholder:text-gray-300"
                            />
                        </div>
                        <button className="bg-primary text-charcoal px-12 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col lg:flex-row gap-20">
                {/* Sidebar Categories */}
                <aside className="w-full lg:w-80 shrink-0 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight ml-1">Categories</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Business Owners', icon: 'storefront', active: true },
                                { name: 'Public Users', icon: 'person' },
                                { name: 'Event Organizers', icon: 'calendar_month' },
                                { name: 'Halal Certification', icon: 'verified' }
                            ].map(cat => (
                                <button key={cat.name} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${cat.active ? 'bg-primary/5 border-primary text-charcoal' : 'bg-white dark:bg-charcoal/20 border-gray-100 dark:border-gray-800 hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${cat.active ? 'bg-primary text-charcoal' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                                        </div>
                                        <span className="font-black text-sm">{cat.name}</span>
                                    </div>
                                    <span className={`material-symbols-outlined text-lg ${cat.active ? 'text-primary' : 'text-gray-300'}`}>chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-[2.5rem] p-10 space-y-8 text-center border-2 border-primary/10">
                        <div className="w-16 h-16 bg-primary rounded-[1.25rem] flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-charcoal text-3xl">support_agent</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-2xl tracking-tight">Still need help?</h3>
                            <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase tracking-widest">Our support team is available <br /> Mon-Fri, 9am - 6pm SGT.</p>
                        </div>
                        <button className="w-full bg-charcoal text-white py-4 rounded-2xl font-black text-sm hover:opacity-95 transition-all shadow-xl active:scale-95">
                            Contact Support
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-20">
                    <section className="space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tight">Business Owners FAQ</h2>
                            <div className="h-1.5 w-12 bg-primary rounded-full" />
                        </div>
                        <div className="space-y-6">
                            {FAQ_ITEMS.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-charcoal/20 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden transition-all hover:shadow-xl hover:border-gray-200">
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full p-8 flex justify-between items-center text-left transition-colors"
                                    >
                                        <span className="font-black text-lg text-charcoal dark:text-white tracking-tight">{item.question}</span>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${openFaq === idx ? 'bg-primary border-primary text-charcoal rotate-180' : 'border-gray-100 text-gray-300'}`}>
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                                            <p className="text-base text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-8 font-medium">
                                                {item.answer}
                                            </p>
                                            <div className="mt-8">
                                                <button className="text-primary text-xs font-black flex items-center gap-1 hover:underline uppercase tracking-widest">
                                                    Go to Registration Guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-10">
                        <h2 className="text-2xl font-black tracking-tight ml-1">Popular Articles for Businesses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { title: 'Guide to MUIS Certification', icon: 'description', color: 'bg-primary/10 text-primary', sub: 'Step-by-step process explained.' },
                                { title: 'Boosting Your Visibility', icon: 'trending_up', color: 'bg-green-50 text-green-500', sub: 'Tips to get more customers.' }
                            ].map(article => (
                                <div key={article.title} className="bg-white dark:bg-charcoal/20 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 flex items-center gap-8 group hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer">
                                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform ${article.color}`}>
                                        <span className="material-symbols-outlined text-4xl">{article.icon}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-lg group-hover:text-primary transition-colors tracking-tight">{article.title}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{article.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
