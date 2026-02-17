
import React, { useState, useEffect } from 'react';
import { BackendService } from '../services/api';
import { Business, UserReview } from '../types';

const DashboardPage: React.FC = () => {
    const [submissions, setSubmissions] = useState<Business[]>([]);
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [activeTab, setActiveTab] = useState('Dashboard');

    useEffect(() => {
        setSubmissions(BackendService.getUserSubmissions());
        setReviews(BackendService.getUserReviews());
    }, []);

    const sidebarItems = [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'My Businesses', icon: 'storefront' },
        { name: 'Saved Listings', icon: 'favorite' },
        { name: 'My Reviews', icon: 'reviews' },
        { name: 'Profile Settings', icon: 'settings' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-10 shrink-0">
                <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?u=ahmad" className="w-14 h-14 rounded-full border-4 border-primary/20" alt="avatar" />
                    <div className="space-y-0.5">
                        <p className="font-black text-lg tracking-tight">Ahmad Hassan</p>
                        <p className="text-xs text-gray-400 font-medium">ahmad.h@email.com</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {sidebarItems.map(item => (
                        <button 
                            key={item.name} 
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.name ? 'bg-primary/10 text-primary-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className={`material-symbols-outlined ${activeTab === item.name ? 'filled' : ''}`}>{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <button className="flex items-center gap-4 px-5 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all">
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 space-y-12">
                <div className="space-y-3">
                    <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">Welcome back, Ahmad!</h1>
                    <p className="text-gray-400 font-medium text-lg">Here's a summary of your account activity.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Submitted Businesses', val: submissions.length, icon: 'storefront', color: 'bg-primary/10 text-primary-dark' },
                        { label: 'Saved Listings', val: '8', icon: 'favorite', color: 'bg-teal-50 text-teal-600' },
                        { label: 'Total Reviews', val: reviews.length, icon: 'reviews', color: 'bg-blue-50 text-blue-600' }
                    ].map(stat => (
                        <div key={stat.label} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                <span className="material-symbols-outlined text-3xl filled">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-4xl font-black mt-1">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Business Submissions Section */}
                <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-black tracking-tight">My Business Submissions</h2>
                        <button className="text-primary-dark text-sm font-black hover:underline uppercase tracking-widest">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-5">Business Name</th>
                                    <th className="px-8 py-5">Submission Date</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {submissions.map(biz => (
                                    <tr key={biz.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-8 py-6 font-bold text-charcoal">{biz.name}</td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{biz.submissionDate}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${biz.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {biz.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-primary-dark text-xs font-black hover:underline uppercase tracking-widest">
                                                {biz.status === 'Approved' ? 'Manage' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recent Reviews Section */}
                <section className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black tracking-tight leading-none">My Recent Reviews</h2>
                        <button className="text-primary-dark text-sm font-black hover:underline uppercase tracking-widest">View All</button>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative group">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black tracking-tight">{review.businessName}</h3>
                                        <p className="text-xs text-gray-400 font-bold">{review.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-all">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined text-lg ${i < review.rating ? 'filled' : 'opacity-20'}`}>star</span>
                                    ))}
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-6">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
