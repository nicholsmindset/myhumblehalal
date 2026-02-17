
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';

const EventsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState('All');

    const eventTypes = ['Bazaar', 'Food Festival', 'Workshop', 'Seminars'];
    const dateRanges = ['All', 'This Weekend', 'Next Week', 'Next Month'];

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType.length === 0 || selectedType.includes(event.type);
            
            // Simplified date filtering logic based on mock data strings
            let matchesDate = true;
            if (dateRange === 'This Weekend') {
                matchesDate = event.date.toLowerCase().includes('mar'); // Mock simulation
            } else if (dateRange === 'Next Month') {
                matchesDate = event.date.toLowerCase().includes('apr'); // Mock simulation
            }

            return matchesSearch && matchesType && matchesDate;
        });
    }, [searchQuery, selectedType, dateRange]);

    const toggleType = (type: string) => {
        setSelectedType(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="space-y-16 py-12 transition-colors duration-300">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-[400px] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDup71s2VVfXxtDvX_tz2dgI1cgXEzdCfWqmcB5OUDCf5XiuS_D65zLm2CV6eIFRXtNX0ARqRTs_qD1E43ZVL06qZikpqxfH_iAyT-hO3kfygelIZJHVUTFYgSeeD7CtHFL5NJSs5KsgLEMlqGIf64FX_m42lWnfvg1MjqTcfRVXp4UrWYwAMd-AbGeyOUOarN2uAkwI6nIDv_C1fBKUOI0X3BAogA4ctzDA2TKgQZU2bzHPVriPiSDRu59NupzwPR2EOUoHACdtvg"
                            className="w-full h-full object-cover brightness-[0.4]"
                            alt="Bazaar"
                        />
                    </div>
                    <div className="relative z-10 space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Discover Halal Events <br /> Across Singapore</h1>
                        <p className="text-gray-200 text-lg">Your guide to upcoming halal-friendly food festivals, bazaars, and more.</p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 space-y-10 shrink-0">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black tracking-tight dark:text-white">Filter Events</h3>
                            <div className="h-1 w-10 bg-primary rounded-full" />
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Search</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">search</span>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Event name..." 
                                        className="w-full pl-10 rounded-xl border-gray-100 dark:border-gray-800 bg-white dark:bg-charcoal text-sm font-bold dark:text-white transition-all focus:ring-primary" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date Range</label>
                                <div className="flex flex-wrap gap-2">
                                    {dateRanges.map(range => (
                                        <button 
                                            key={range}
                                            onClick={() => setDateRange(range)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${dateRange === range ? 'bg-primary border-primary text-charcoal shadow-lg' : 'bg-white dark:bg-charcoal border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Event Type</label>
                                <div className="space-y-2">
                                    {eventTypes.map(type => (
                                        <label key={type} className="flex items-center gap-3 text-sm cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedType.includes(type)}
                                                onChange={() => toggleType(type)}
                                                className="rounded-lg text-primary focus:ring-primary border-gray-200 dark:border-gray-800 dark:bg-charcoal w-5 h-5" 
                                            />
                                            <span className={`font-bold transition-colors ${selectedType.includes(type) ? 'text-primary' : 'text-gray-500 group-hover:text-charcoal dark:group-hover:text-white'}`}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1 space-y-8">
                        <div className="flex justify-between items-baseline">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white">Upcoming Events</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredEvents.length} Events found</p>
                        </div>

                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredEvents.map(event => (
                                    <Link to={`/event/${event.id}`} key={event.id} className="bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col group">
                                        <div className="h-64 relative overflow-hidden">
                                            <img src={event.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={event.title} />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary text-charcoal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{event.type}</span>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-4 flex-1">
                                            <h3 className="text-2xl font-black group-hover:text-primary transition-colors dark:text-white">{event.title}</h3>
                                            <div className="space-y-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <p className="flex items-center gap-3"><span className="material-symbols-outlined text-lg text-primary">calendar_today</span> {event.date}</p>
                                                <p className="flex items-center gap-3"><span className="material-symbols-outlined text-lg text-primary">location_on</span> {event.location}</p>
                                            </div>
                                            <button className="w-full bg-primary/10 text-primary dark:bg-primary/5 group-hover:bg-primary group-hover:text-charcoal font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-sm group-hover:shadow-lg">
                                                View Details
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/30 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                                <span className="material-symbols-outlined text-7xl text-gray-200 dark:text-gray-700 mb-6">event_busy</span>
                                <h3 className="text-2xl font-black text-gray-400">No events found</h3>
                                <p className="text-gray-400 mt-2 font-medium">Try adjusting your filters or searching for something else.</p>
                                <button 
                                    onClick={() => {setSearchQuery(''); setSelectedType([]); setDateRange('All');}}
                                    className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-charcoal text-white rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Hosting an Event?</h2>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">Reach the halal-conscious community in Singapore by listing your event on our directory. From bazaars to workshops, we've got you covered.</p>
                    </div>
                    <Link to="/submit-event" className="relative z-10 inline-flex items-center gap-3 bg-primary text-charcoal px-10 py-5 rounded-[1.5rem] font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm uppercase tracking-widest">
                        <span className="material-symbols-outlined font-black">add_circle</span> List Your Event
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default EventsPage;
