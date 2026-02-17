
import React, { useState } from 'react';

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const menuItems = [
        { name: 'Dashboard', icon: 'dashboard' },
        { name: 'Submissions', icon: 'pending_actions' },
        { name: 'Business Listings', icon: 'storefront' },
        { name: 'Users', icon: 'groups' },
        { name: 'Categories & Tags', icon: 'sell' },
        { name: 'Analytics', icon: 'bar_chart' },
        { name: 'Reported Content', icon: 'flag' },
        { name: 'Settings', icon: 'settings' }
    ];

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
                        <img src="https://i.pravatar.cc/150?u=admin" className="w-12 h-12 rounded-full border-2 border-primary/20" alt="admin" />
                        <div>
                            <p className="font-bold text-sm">Admin Name</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Administrator</p>
                        </div>
                    </div>
                    <button className="w-full bg-[#006A4E] text-white py-4 rounded-xl font-black text-sm hover:opacity-95 transition-all shadow-xl shadow-primary/10">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter leading-none text-charcoal">Dashboard</h1>
                        <p className="text-gray-400 font-medium text-lg">Welcome back, Admin! Here's an overview of your directory.</p>
                    </div>
                    <button className="bg-primary text-charcoal px-8 py-4 rounded-xl font-black text-sm flex items-center gap-3 shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">add</span>
                        Add New Listing
                    </button>
                </header>

                {/* System Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Pending Submissions', val: '12', trend: '+5 this week', color: 'text-orange-500' },
                        { label: 'Active Listings', val: '1,204', trend: '+20 this week', color: 'text-green-500' },
                        { label: 'Registered Users', val: '850', trend: '+15 this week', color: 'text-blue-500' },
                        { label: 'Recent Reports', val: '5', trend: '-1 from yesterday', color: 'text-red-500' }
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
                        {[
                            { title: "New Submission: 'Makan Delights'", sub: "Submitted by user 'john.doe'. Awaiting review.", time: "2 minutes ago", icon: "storefront", color: "bg-primary/10 text-primary-dark" },
                            { title: "New User: 'jane.smith'", sub: "A new user registered on the platform.", time: "15 minutes ago", icon: "person_add", color: "bg-blue-50 text-blue-500" },
                            { title: "Approved: 'Satay Sedap Corner'", sub: "Listing approved and is now live.", time: "1 hour ago", icon: "check_circle", color: "bg-green-50 text-green-500" },
                            { title: "New Report: 'Curry Puff King'", sub: "A user has reported this listing for review.", time: "3 hours ago", icon: "flag", color: "bg-red-50 text-red-500" },
                            { title: "New Submission: 'Nasi Lemak Village'", sub: "Submitted by user 'ahmad_lim'. Awaiting review.", time: "5 hours ago", icon: "storefront", color: "bg-primary/10 text-primary-dark" }
                        ].map((act, i) => (
                            <div key={i} className="p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${act.color}`}>
                                    <span className="material-symbols-outlined text-2xl filled">{act.icon}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-black text-charcoal">{act.title}</p>
                                    <p className="text-sm text-gray-400 font-medium">{act.sub}</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
