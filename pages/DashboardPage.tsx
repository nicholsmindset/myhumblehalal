
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { businesses, reviews as reviewsDb, users, notifications } from '../services/db';
import { Business, UserReview } from '../types';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [submissions, setSubmissions] = useState<Business[]>([]);
    const [bookmarkedBusinesses, setBookmarkedBusinesses] = useState<Business[]>([]);
    const [userReviews, setUserReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [submissionsResult, reviewsList] = await Promise.all([
                businesses.list({ ownerId: user.id }),
                reviewsDb.listByUser(user.id),
            ]);
            setSubmissions(submissionsResult.data);
            setUserReviews(reviewsList);

            // Fetch bookmarked businesses
            if (user.bookmarks && user.bookmarks.length > 0) {
                const bookmarked = await Promise.all(
                    user.bookmarks.map(id => businesses.getById(id))
                );
                setBookmarkedBusinesses(bookmarked.filter((b): b is Business => b !== null));
            } else {
                setBookmarkedBusinesses([]);
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteReview = async (reviewId: string) => {
        await reviewsDb.delete(reviewId);
        // Refresh reviews
        if (user) {
            const updated = await reviewsDb.listByUser(user.id);
            setUserReviews(updated);
        }
    };

    const handleRemoveBookmark = async (businessId: string) => {
        if (!user) return;
        await users.toggleBookmark(user.id, businessId);
        setBookmarkedBusinesses(prev => prev.filter(b => b.id !== businessId));
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-medium text-lg">Please log in to view your dashboard.</p>
            </div>
        );
    }

    const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : '?';

    const sidebarItems = [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'My Businesses', icon: 'storefront' },
        { name: 'Saved Listings', icon: 'favorite' },
        { name: 'My Reviews', icon: 'reviews' },
        { name: 'Profile Settings', icon: 'settings' }
    ];

    const statusBadge = (status?: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700';
            case 'Pending Review':
                return 'bg-orange-100 text-orange-700';
            case 'Rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // ---- Tab content renderers ----

    const renderDashboard = () => (
        <>
            <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-400 font-medium text-lg">Here's a summary of your account activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Submitted Businesses', val: submissions.length, icon: 'storefront', color: 'bg-primary/10 text-primary-dark' },
                    { label: 'Saved Listings', val: user.bookmarks ? user.bookmarks.length : 0, icon: 'favorite', color: 'bg-teal-50 text-teal-600' },
                    { label: 'Total Reviews', val: userReviews.length, icon: 'reviews', color: 'bg-blue-50 text-blue-600' }
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

            {/* Recent Submissions Preview */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-2xl font-black tracking-tight">My Business Submissions</h2>
                    <button onClick={() => setActiveTab('My Businesses')} className="text-primary-dark text-sm font-black hover:underline uppercase tracking-widest">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Business Name</th>
                                <th className="px-8 py-5">Submission Date</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {submissions.slice(0, 5).map(biz => (
                                <tr key={biz.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-charcoal">{biz.name}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{biz.submissionDate || 'N/A'}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(biz.status)}`}>
                                            {biz.status || 'Unknown'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-8 py-12 text-center text-gray-400 font-medium">No business submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Recent Reviews Preview */}
            <section className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black tracking-tight leading-none">My Recent Reviews</h2>
                    <button onClick={() => setActiveTab('My Reviews')} className="text-primary-dark text-sm font-black hover:underline uppercase tracking-widest">View All</button>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    {userReviews.slice(0, 3).map(review => (
                        <div key={review.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative group">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black tracking-tight">{review.businessName}</h3>
                                    <p className="text-xs text-gray-400 font-bold">{review.date}</p>
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
                    {userReviews.length === 0 && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                            <p className="text-gray-400 font-medium">No reviews written yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );

    const renderMyBusinesses = () => (
        <>
            <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">My Businesses</h1>
                <p className="text-gray-400 font-medium text-lg">Manage your submitted business listings.</p>
            </div>

            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Business Name</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Submission Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {submissions.map(biz => (
                                <tr key={biz.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-charcoal">{biz.name}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{biz.category}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{biz.submissionDate || 'N/A'}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(biz.status)}`}>
                                            {biz.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-primary-dark text-xs font-black hover:underline uppercase tracking-widest">
                                            {biz.status === 'Approved' ? 'Manage' : 'View'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-medium">No business submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );

    const renderSavedListings = () => (
        <>
            <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">Saved Listings</h1>
                <p className="text-gray-400 font-medium text-lg">Your bookmarked businesses for quick access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bookmarkedBusinesses.map(biz => (
                    <div key={biz.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black tracking-tight">{biz.name}</h3>
                                <p className="text-xs text-gray-400 font-bold">{biz.category} &middot; {biz.region}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveBookmark(biz.id)}
                                className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
                                title="Remove bookmark"
                            >
                                <span className="material-symbols-outlined text-lg">bookmark_remove</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 font-medium line-clamp-2">{biz.description || biz.address}</p>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5 text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-sm ${i < Math.round(biz.rating) ? 'filled' : 'opacity-20'}`}>star</span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 font-bold">{biz.rating} ({biz.reviewCount} reviews)</span>
                        </div>
                    </div>
                ))}
            </div>
            {bookmarkedBusinesses.length === 0 && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-400 font-medium">No saved listings yet. Bookmark businesses you love!</p>
                </div>
            )}
        </>
    );

    const renderMyReviews = () => (
        <>
            <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">My Reviews</h1>
                <p className="text-gray-400 font-medium text-lg">All reviews you've written across the platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {userReviews.map(review => (
                    <div key={review.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative group">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black tracking-tight">{review.businessName}</h3>
                                <p className="text-xs text-gray-400 font-bold">{review.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/review/${review.businessId}`)}
                                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-all"
                                    title="Edit review"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
                                    title="Delete review"
                                >
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
                {userReviews.length === 0 && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                        <p className="text-gray-400 font-medium">No reviews written yet.</p>
                    </div>
                )}
            </div>
        </>
    );

    const renderProfileSettings = () => (
        <>
            <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-none text-charcoal">Profile Settings</h1>
                <p className="text-gray-400 font-medium text-lg">View your account information. Editing will be available soon.</p>
            </div>

            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark text-3xl font-black">
                        {avatarInitial}
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-black tracking-tight">{user.name}</p>
                        <p className="text-sm text-gray-400 font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input
                            type="text"
                            value={user.name}
                            readOnly
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-charcoal font-bold cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-charcoal font-bold cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</label>
                        <input
                            type="tel"
                            value={user.phone || 'Not provided'}
                            readOnly
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-charcoal font-bold cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscription Plan</label>
                        <input
                            type="text"
                            value={user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : 'Free'}
                            readOnly
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-charcoal font-bold cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <p className="text-xs text-gray-400 font-medium italic">Profile editing will be enabled with Supabase integration.</p>
                </div>
            </section>
        </>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-400 font-medium text-lg">Loading...</div>
                </div>
            );
        }

        switch (activeTab) {
            case 'Dashboard': return renderDashboard();
            case 'My Businesses': return renderMyBusinesses();
            case 'Saved Listings': return renderSavedListings();
            case 'My Reviews': return renderMyReviews();
            case 'Profile Settings': return renderProfileSettings();
            default: return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center text-primary-dark text-xl font-black">
                        {avatarInitial}
                    </div>
                    <div className="space-y-0.5">
                        <p className="font-black text-lg tracking-tight">{user.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
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

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-5 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 space-y-12">
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;
