import React, { useState } from 'react';
import { leads } from '../services/db';

interface LeadFormProps {
    businessId: string;
    businessName: string;
}

type InquiryType = 'general' | 'catering' | 'event' | 'quote' | 'partnership';

const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: 'general',     label: 'General Inquiry' },
    { value: 'catering',    label: 'Catering Request' },
    { value: 'event',       label: 'Event Enquiry' },
    { value: 'quote',       label: 'Request a Quote' },
    { value: 'partnership', label: 'Partnership' },
];

const LeadForm: React.FC<LeadFormProps> = ({ businessId, businessName }) => {
    const [name, setName]     = useState('');
    const [email, setEmail]   = useState('');
    const [phone, setPhone]   = useState('');
    const [type, setType]     = useState<InquiryType>('general');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);
    const [error, setError]           = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await leads.create({
                businessId,
                name,
                email,
                phone: phone || undefined,
                type,
                message,
                status: 'new',
            });
            setSubmitted(true);
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
                <p className="font-black text-emerald-800 text-sm">Message Sent!</p>
                <p className="text-xs text-emerald-700">{businessName} will be in touch shortly.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-charcoal dark:text-white">Contact Business</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-2.5 px-4"
                />
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-2.5 px-4"
                />
                <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-2.5 px-4"
                />
                <select
                    value={type}
                    onChange={e => setType(e.target.value as InquiryType)}
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-2.5 px-4"
                >
                    {INQUIRY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Your message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-2.5 px-4 resize-none"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-charcoal font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {submitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default LeadForm;
