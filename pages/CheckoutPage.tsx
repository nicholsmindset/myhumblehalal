
import React from 'react';

const CheckoutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
            <h1 className="text-4xl font-black tracking-tight text-center">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-charcoal/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="text-xl font-bold">Billing Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">First Name</label>
                                <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Last Name</label>
                                <input type="text" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                                <input type="email" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
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
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Card Number</label>
                                <input type="text" placeholder="**** **** **** ****" className="w-full rounded-xl border-gray-200 dark:border-gray-800 dark:bg-charcoal" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-charcoal text-white p-8 rounded-3xl space-y-6 sticky top-24 shadow-xl">
                        <h3 className="text-xl font-bold">Order Summary</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between opacity-70">
                                <span>Premium Plan</span>
                                <span>$49.00</span>
                            </div>
                            <div className="flex justify-between opacity-70">
                                <span>GST (9%)</span>
                                <span>$4.41</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">$53.41</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary text-charcoal py-4 rounded-xl font-bold hover:bg-primary/90 transition-all">
                            Complete Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
