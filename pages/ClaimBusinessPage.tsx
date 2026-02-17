import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { businesses, businessClaims } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Business } from '../types';

const ClaimBusinessPage: React.FC = () => {
    const { businessId } = useParams<{ businessId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [business, setBusiness] = useState<Business | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [proofUrl, setProofUrl] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!businessId) return;
            const biz = await businesses.getById(businessId);
            setBusiness(biz);
            setIsLoading(false);
        };
        load();
    }, [businessId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !businessId) return;
        setSubmitting(true);
        setError('');
        try {
            await businessClaims.create({
                businessId,
                userId: user.id,
                proofUrl: proofUrl || undefined,
                message,
                status: 'pending',
            });
            setSubmitted(true);
        } catch {
            setError('Failed to submit claim. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!business) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
                <p className="text-gray-500">Business not found.</p>
                <Link to="/directory" className="text-primary font-bold hover:underline mt-4 inline-block">Browse Directory</Link>
            </div>
        );
    }

    if (business.isClaimed) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
                <span className="material-symbols-outlined text-amber-500 text-5xl">info</span>
                <h1 className="text-2xl font-black text-charcoal dark:text-white">Already Claimed</h1>
                <p className="text-gray-500 text-sm">{business.name} has already been claimed by its owner.</p>
                <Link to={`/business/${business.slug ?? business.id}`} className="text-primary font-bold hover:underline">Back to listing</Link>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
                <span className="material-symbols-outlined text-emerald-600 text-5xl">check_circle</span>
                <h1 className="text-2xl font-black text-charcoal dark:text-white">Claim Submitted</h1>
                <p className="text-gray-500 text-sm">
                    Your claim for <strong>{business.name}</strong> has been received. Our team will review it and contact you at <strong>{user?.email}</strong> within 3–5 business days.
                </p>
                <Link to={`/business/${business.slug ?? business.id}`} className="text-primary font-bold hover:underline">Back to listing</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link to={`/business/${business.slug ?? business.id}`} className="hover:text-primary transition-colors">{business.name}</Link>
                <span>/</span>
                <span className="text-charcoal dark:text-white">Claim Business</span>
            </nav>

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-charcoal dark:text-white">Claim This Business</h1>
                <p className="text-gray-500 text-sm">
                    Are you the owner of <strong>{business.name}</strong>? Submit a claim to manage your listing, respond to reviews, and access business analytics.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl p-8 space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Proof of Ownership (URL)</label>
                    <input
                        type="url"
                        placeholder="e.g. link to business registration, social profile, or website"
                        value={proofUrl}
                        onChange={e => setProofUrl(e.target.value)}
                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-3 px-4"
                    />
                    <p className="text-xs text-gray-400">Optional but speeds up verification. E.g. ACRA registration link, Google Business page, or Facebook page.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message to Admin *</label>
                    <textarea
                        placeholder="Briefly explain your relationship to this business..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dark:text-white py-3 px-4 resize-none"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-primary text-charcoal font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Claim'}
                    </button>
                </div>
            </form>

            <p className="text-xs text-center text-gray-400">
                We review all claims within 3–5 business days. False claims may result in account suspension.
            </p>
        </div>
    );
};

export default ClaimBusinessPage;
