
import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../services/db';

const PLANS: Record<string, { name: string; price: number }> = {
    premium: { name: 'Premium Plan', price: 49 },
    corporate: { name: 'Corporate Plan', price: 199 },
};

const CheckoutPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    const planKey = searchParams.get('plan') || 'premium';
    const plan = PLANS[planKey] || PLANS.premium;

    const [firstName, setFirstName] = useState(() => user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(() => {
        const parts = user?.name?.split(' ') || [];
        return parts.length > 1 ? parts.slice(1).join(' ') : '';
    });
    const [email, setEmail] = useState(() => user?.email || '');
    const [company, setCompany] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const gst = useMemo(() => Math.round(plan.price * 0.09 * 100) / 100, [plan.price]);
    const total = useMemo(() => Math.round((plan.price + gst) * 100) / 100, [plan.price, gst]);

    const handleSubscribe = async () => {
        if (!user) {
            setError('You must be logged in to subscribe.');
            return;
        }
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await users.update(user.id, {
                subscription: planKey as 'premium' | 'corporate',
                subscriptionStatus: 'active',
                subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            });
            await refreshUser();
            navigate('/dashboard', { state: { subscriptionSuccess: true } });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
            <h1 className="text-4xl font-black tracking-tight text-center">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="bg-white dark:bg-charcoal/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="text-xl font-bold">Billing Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Company <span className="normal-case text-gray-300 dark:text-gray-600">(optional)</span></label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-charcoal/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="text-xl font-bold">Payment Method</h3>
                        <div className="space-y-4">
                            <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary">credit_card</span>
                                    <span className="font-bold">Credit / Debit Card</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                    <div className="w-8 h-5 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-charcoal/40 rounded-2xl text-center space-y-3">
                                <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Stripe integration coming soon. Your subscription will be activated immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-charcoal text-white p-8 rounded-3xl space-y-6 sticky top-24 shadow-xl">
                        <h3 className="text-xl font-bold">Order Summary</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between opacity-70">
                                <span>{plan.name}</span>
                                <span>${plan.price.toFixed(2)}/mo</span>
                            </div>
                            <div className="flex justify-between opacity-70">
                                <span>GST (9%)</span>
                                <span>${gst.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">${total.toFixed(2)}/mo</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            disabled={submitting}
                            className="w-full bg-primary text-charcoal py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Processing...' : 'Subscribe Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
