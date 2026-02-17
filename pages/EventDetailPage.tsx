
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';

const EventDetailPage: React.FC = () => {
    const { id } = useParams();
    const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 gap-2">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to="/events" className="hover:text-primary">Events</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="font-medium text-charcoal dark:text-white">{event.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl">
                        <img src={event.imageUrl} className="w-full h-full object-cover" alt={event.title} />
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary text-charcoal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{event.type}</span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{event.title}</h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {event.description}
                        </p>
                        <div className="p-8 bg-white dark:bg-charcoal/20 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-6">
                            <h3 className="text-xl font-bold">Event Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">calendar_month</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Date</p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Time</p>
                                        <p className="text-sm text-gray-500">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Location</p>
                                        <p className="text-sm text-gray-500">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <div>
                                        <p className="font-bold">Price</p>
                                        <p className="text-sm text-gray-500">{event.isFree ? 'Free Admission' : `$${event.price}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-primary text-charcoal p-8 rounded-3xl space-y-6 shadow-xl sticky top-24">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black">Get Your Tickets</h3>
                            <p className="text-sm font-medium opacity-80">Don't miss out on this amazing event!</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold border-b border-charcoal/10 pb-4">
                                <span>General Admission</span>
                                <span>{event.isFree ? 'FREE' : `$${event.price}`}</span>
                            </div>
                            <Link to="/checkout" className="block w-full bg-charcoal text-white text-center py-4 rounded-xl font-bold hover:bg-charcoal/90 transition-all">
                                {event.isFree ? 'Register Now' : 'Buy Tickets'}
                            </Link>
                        </div>
                        <p className="text-[10px] text-center opacity-60">* No refunds available for this event.</p>
                    </div>

                    <div className="bg-white dark:bg-charcoal/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                        <h4 className="font-bold">Share with friends</h4>
                        <div className="flex gap-2">
                            {['facebook', 'instagram', 'twitter'].map(p => (
                                <button key={p} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:text-primary transition-colors">
                                    <img src={`https://cdn.simpleicons.org/${p}/0d1b14`} className="w-5 h-5 dark:invert" alt={p} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
