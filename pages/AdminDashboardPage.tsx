
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { businesses, reviews, users } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Business, User, UserReview } from '../types';

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Stats
    const [bizStats, setBizStats] = useState({ total: 0, pending: 0, rejected: 0, featured: 0 });
    const [userStats, setUserStats] = useState({ total: 0, admins: 0, owners: 0 });
    const [reviewCount, setReviewCount] = useState(0);

    // Dashboard activity feed
    const [recentPending, setRecentPending] = useState<Business[]>([]);

    // Submissions tab
    const [pendingSubmissions, setPendingSubmissions] = useState<Business[]>([]);

    // Business Listings tab
    const [approvedBusinesses, setApprovedBusinesses] = useState<Business[]>([]);

    // Users tab
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const menuItems = [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'Submissions', icon: 'pending_actions' },
        { name: 'Business Listings', icon: 'storefront' },
        { name: 'Users', icon: 'groups' },
        { name: 'Analytics', icon: 'bar_chart' },
        { name: 'Settings', icon: 'settings' }
    ];

    const fetchStats = useCallback(async () => {
        const [bStats, uStats, allReviews] = await Promise.all([
            businesses.getStats(),
            users.getStats(),
            reviews.listAll(),
        ]);
        setBizStats(bStats);
        setUserStats(uStats);
        setReviewCount(allReviews.length);
    }, []);

    const fetchRecentPending = useCallback(async () => {
        const result = await businesses.list({ status: 'Pending Review', limit: 5 });
        setRecentPending(result.data);
    }, []);

    const fetchPendingSubmissions = useCallback(async () => {
        const result = await businesses.list({ status: 'Pending Review', limit: 100 });
        setPendingSubmissions(result.data);
    }, []);

    const fetchApprovedBusinesses = useCallback(async () => {
        const result = await businesses.list({ status: 'Approved', limit: 100 });
        setApprovedBusinesses(result.data);
    }, []);

    const fetchAllUsers = useCallback(async () => {
        const list = await users.list();
        setAllUsers(list);
    }, []);

    // Fetch stats and activity on mount
    useEffect(() => {
        fetchStats();
        fetchRecentPending();
    }, [fetchStats, fetchRecentPending]);

    // Fetch tab-specific data when switching tabs
    useEffect(() => {
        if (activeTab === 'Submissions') fetchPendingSubmissions();
        if (activeTab === 'Business Listings') fetchApprovedBusinesses();
        if (activeTab === 'Users') fetchAllUsers();
    }, [activeTab, fetchPendingSubmissions, fetchApprovedBusinesses, fetchAllUsers]);

    const handleApprove = async (id: string) => {
        await businesses.update(id, { status: 'Approved' });
        await fetchPendingSubmissions();
        await fetchStats();
        await fetchRecentPending();
    };

    const handleReject = async (id: string) => {
        await businesses.update(id, { status: 'Rejected' });
        await fetchPendingSubmissions();
        await fetchStats();
        await fetchRecentPending();
    };

    const handleDeleteBusiness = async (id: string) => {
        await businesses.delete(id);
        await fetchApprovedBusinesses();
        await fetchStats();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const formatTimeAgo = (dateStr?: string) => {
        if (!dateStr) return 'Unknown';
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    };

    const renderDashboard = () => (
        <>
            {/* System Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Pending Submissions', val: bizStats.pending.toLocaleString(), trend: `${bizStats.rejected} rejected`, color: 'text-orange-500' },
                    { label: 'Active Listings', val: bizStats.total.toLocaleString(), trend: `${bizStats.featured} featured`, color: 'text-green-500' },
                    { label: 'Registered Users', val: userStats.total.toLocaleString(), trend: `${userStats.owners} owners`, color: 'text-blue-500' },
                    { label: 'Total Reviews', val: reviewCount.toLocaleString(), trend: `${userStats.admins} admin${userStats.admins === 1 ? '' : 's'}`, color: 'text-purple-500' }
                ].map(stat => (
                    <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="space-y-1">
                            <p className="text-5xl font-black tracking-tighter leading-none">{stat.val}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h2 className="text-2xl font-black tracking-tight leading-none">Recent Activities</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentPending.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 font-medium">
                            No pending submissions at this time.
                        </div>
                    ) : (
                        recentPending.map((biz) => (
                            <div key={biz.id} className="p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-primary/10 text-primary-dark">
                                    <span className="material-symbols-outlined text-2xl filled">storefront</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-black text-charcoal">New Submission: '{biz.name}'</p>
                                    <p className="text-sm text-gray-400 font-medium">{biz.category} - {biz.region}. Awaiting review.</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">
                                    {formatTimeAgo(biz.submissionDate)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );

    const renderSubmissions = () => (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black tracking-tight leading-none">Moderation Queue</h2>
                <p className="text-gray-400 font-medium mt-2">{pendingSubmissions.length} submission{pendingSubmissions.length === 1 ? '' : 's'} awaiting review</p>
            </div>
            <div className="divide-y divide-gray-50">
                {pendingSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-medium">
                        All caught up! No pending submissions.
                    </div>
                ) : (
                    pendingSubmissions.map((biz) => (
                        <div key={biz.id} className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <img src={biz.imageUrl} alt={biz.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                            <div className="flex-1 space-y-1">
                                <p className="font-black text-charcoal text-lg">{biz.name}</p>
                                <p className="text-sm text-gray-400 font-medium">{biz.category} - {biz.region}</p>
                                {biz.description && <p className="text-sm text-gray-500 line-clamp-2">{biz.description}</p>}
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                    Submitted {formatTimeAgo(biz.submissionDate)}
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button
                                    onClick={() => handleApprove(biz.id)}
                                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(biz.id)}
                                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );

    const renderBusinessListings = () => (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black tracking-tight leading-none">Business Listings</h2>
                <p className="text-gray-400 font-medium mt-2">{approvedBusinesses.length} approved listing{approvedBusinesses.length === 1 ? '' : 's'}</p>
            </div>
            <div className="divide-y divide-gray-50">
                {approvedBusinesses.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-medium">
                        No approved listings yet.
                    </div>
                ) : (
                    approvedBusinesses.map((biz) => (
                        <div key={biz.id} className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                            <img src={biz.imageUrl} alt={biz.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                            <div className="flex-1 space-y-1">
                                <p className="font-black text-charcoal">{biz.name}</p>
                                <p className="text-sm text-gray-400 font-medium">{biz.category} - {biz.region}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-yellow-500 text-lg filled">star</span>
                                    <span className="font-bold">{biz.rating}</span>
                                    <span className="text-gray-300">({biz.reviewCount})</span>
                                </div>
                                {biz.isFeatured && (
                                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Featured</span>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => navigate(`/business/${biz.id}`)}
                                    className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                                    title="View"
                                >
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteBusiness(biz.id)}
                                    className="p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );

    const renderUsers = () => (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black tracking-tight leading-none">All Users</h2>
                <p className="text-gray-400 font-medium mt-2">{allUsers.length} registered user{allUsers.length === 1 ? '' : 's'}</p>
            </div>
            <div className="divide-y divide-gray-50">
                {allUsers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-medium">
                        No users found.
                    </div>
                ) : (
                    allUsers.map((u) => (
                        <div key={u.id} className="p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-100 shrink-0 bg-emerald-100 flex items-center justify-center">
                                <span className="text-emerald-700 font-black text-base">{u.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="font-black text-charcoal">{u.name}</p>
                                <p className="text-sm text-gray-400 font-medium">{u.email}</p>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'business_owner' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                                {u.role === 'business_owner' ? 'Owner' : u.role}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );

    const renderAnalytics = () => (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black tracking-tight leading-none">Analytics</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-charcoal">Business Breakdown</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Approved', value: bizStats.total, color: 'bg-green-500' },
                            { label: 'Pending', value: bizStats.pending, color: 'bg-orange-500' },
                            { label: 'Rejected', value: bizStats.rejected, color: 'bg-red-500' },
                            { label: 'Featured', value: bizStats.featured, color: 'bg-yellow-500' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm font-bold text-gray-600 flex-1">{item.label}</span>
                                <span className="text-2xl font-black tracking-tight">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-charcoal">User Breakdown</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Users', value: userStats.total, color: 'bg-blue-500' },
                            { label: 'Admins', value: userStats.admins, color: 'bg-purple-500' },
                            { label: 'Business Owners', value: userStats.owners, color: 'bg-teal-500' },
                            { label: 'Total Reviews', value: reviewCount, color: 'bg-pink-500' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm font-bold text-gray-600 flex-1">{item.label}</span>
                                <span className="text-2xl font-black tracking-tight">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    const renderSettings = () => (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black tracking-tight leading-none">Settings</h2>
            </div>
            <div className="p-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-charcoal">Admin Profile</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full border-2 border-primary/20 bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-700 font-black text-2xl">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-black">{user?.name || 'Admin'}</p>
                            <p className="text-sm text-gray-400 font-medium">{user?.email || 'admin@example.com'}</p>
                            <p className="text-[10px] font-black text-primary-dark uppercase tracking-widest">{user?.role || 'admin'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return renderDashboard();
            case 'Submissions': return renderSubmissions();
            case 'Business Listings': return renderBusinessListings();
            case 'Users': return renderUsers();
            case 'Analytics': return renderAnalytics();
            case 'Settings': return renderSettings();
            default: return renderDashboard();
        }
    };

    const tabTitles: Record<string, { title: string; subtitle: string }> = {
        Dashboard: { title: 'Dashboard', subtitle: `Welcome back, ${user?.name || 'Admin'}! Here's an overview of your directory.` },
        Submissions: { title: 'Submissions', subtitle: 'Review and moderate pending business submissions.' },
        'Business Listings': { title: 'Business Listings', subtitle: 'Manage all approved business listings.' },
        Users: { title: 'Users', subtitle: 'View and manage registered users.' },
        Analytics: { title: 'Analytics', subtitle: 'Platform statistics at a glance.' },
        Settings: { title: 'Settings', subtitle: 'Manage your admin profile and preferences.' },
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] flex flex-col md:row md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary-dark">
                        <span className="material-symbols-outlined text-2xl filled">verified</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight">Halal Admin</h2>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === item.name ? 'bg-primary/10 text-primary-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-gray-50 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-emerald-700 font-black text-base">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#059669] text-white py-4 rounded-xl font-black text-sm hover:opacity-95 transition-all shadow-xl shadow-primary/10"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter leading-none text-charcoal">
                            {tabTitles[activeTab]?.title || activeTab}
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            {tabTitles[activeTab]?.subtitle || ''}
                        </p>
                    </div>
                    {activeTab === 'Dashboard' && (
                        <button
                            onClick={() => setActiveTab('Submissions')}
                            className="bg-primary text-charcoal px-8 py-4 rounded-xl font-black text-sm flex items-center gap-3 shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">pending_actions</span>
                            Review Submissions
                        </button>
                    )}
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboardPage;
