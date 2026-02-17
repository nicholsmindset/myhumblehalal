
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { events } from '../services/db';
import { useAuth } from '../contexts/AuthContext';

const EVENT_TYPES = ['Bazaar', 'Food Festival', 'Workshop', 'Seminar'];

const SubmitEventPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [type, setType] = useState(EVENT_TYPES[0]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Event title is required';
        if (!startDate) newErrors.startDate = 'Start date is required';
        if (!endDate) newErrors.endDate = 'End date is required';
        if (!location.trim()) newErrors.location = 'Location is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !user) return;

        setSubmitting(true);
        try {
            await events.create({
                title,
                type,
                date: startDate === endDate ? startDate : `${startDate} - ${endDate}`,
                time,
                location,
                description,
                isFree,
                price: isFree ? undefined : Number(price),
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDup71s2VVfXxtDvX_tz2dgI1cgXEzdCfWqmcB5OUDCf5XiuS_D65zLm2CV6eIFRXtNX0ARqRTs_qD1E43ZVL06qZikpqxfH_iAyT-hO3kfygelIZJHVUTFYgSeeD7CtHFL5NJSs5KsgLEMlqGIf64FX_m42lWnfvg1MjqTcfRVXp4UrWYwAMd-AbGeyOUOarN2uAkwI6nIDv_C1fBKUOI0X3BAogA4ctzDA2TKgQZU2bzHPVriPiSDRu59NupzwPR2EOUoHACdtvg',
                status: 'Approved',
                ownerId: user.id,
            });
            navigate('/events');
        } catch (err) {
            console.error('Failed to create event:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">List Your Halal Event</h1>
                <p className="text-gray-500 text-lg">Promote your upcoming food fest, bazaar, or workshop.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-charcoal/20 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Event Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Geylang Serai Ramadan Bazaar"
                            className={`w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal ${errors.title ? 'border-red-500' : ''}`}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Event Type</label>
                        <select
                            className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            {EVENT_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Time</label>
                        <input
                            type="text"
                            placeholder="e.g. 10:00 AM - 10:00 PM"
                            className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Start Date</label>
                        <input
                            type="date"
                            className={`w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal ${errors.startDate ? 'border-red-500' : ''}`}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">End Date</label>
                        <input
                            type="date"
                            className={`w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal ${errors.endDate ? 'border-red-500' : ''}`}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Location Details</label>
                        <textarea
                            placeholder="Full address or venue name..."
                            className={`w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal ${errors.location ? 'border-red-500' : ''}`}
                            rows={3}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold">Description</label>
                        <textarea
                            placeholder="Tell us about the event highlights..."
                            className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                            rows={5}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold">Free Event</label>
                            <button
                                type="button"
                                onClick={() => setIsFree(!isFree)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFree ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFree ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                        {!isFree && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Price ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 15"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-charcoal py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">publish</span>
                        {submitting ? 'Submitting...' : 'Submit Event for Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitEventPage;
