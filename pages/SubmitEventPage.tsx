
import React from 'react';

const SubmitEventPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">List Your Halal Event</h1>
                <p className="text-gray-500 text-lg">Promote your upcoming food fest, bazaar, or workshop.</p>
            </div>

            <div className="bg-white dark:bg-charcoal/20 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Event Title</label>
                        <input type="text" placeholder="e.g. Geylang Serai Ramadan Bazaar" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Event Type</label>
                        <select className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal">
                            <option>Bazaar</option>
                            <option>Food Festival</option>
                            <option>Workshop</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Expected Attendance</label>
                        <input type="number" placeholder="e.g. 500" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Start Date</label>
                        <input type="date" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">End Date</label>
                        <input type="date" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Location Details</label>
                        <textarea placeholder="Full address or venue name..." className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" rows={3} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Description</label>
                        <textarea placeholder="Tell us about the event highlights..." className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" rows={5} />
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                    <button className="w-full bg-primary text-charcoal py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">publish</span>
                        Submit Event for Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitEventPage;
