
import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-16">
            <aside className="w-full lg:w-72 shrink-0 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Navigation</h3>
                <nav className="space-y-2">
                    {[
                        { n: '1. Introduction', active: true },
                        { n: '2. Information We Collect' },
                        { n: '3. How We Use Your Info' },
                        { n: '4. Sharing of Information' },
                        { n: '5. User Rights' },
                        { n: '6. Cookies & Tracking' },
                        { n: '7. Contact Us' }
                    ].map(link => (
                        <button key={link.n} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${link.active ? 'bg-primary text-charcoal shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-charcoal'}`}>
                            {link.n}
                        </button>
                    ))}
                </nav>
                <div className="pt-8 border-t border-gray-100 space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Looking for Terms of Service?</p>
                    <button className="text-primary text-xs font-black flex items-center gap-1 hover:underline">
                        Go to Terms of Service <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 space-y-12">
                <header className="space-y-4 border-b border-gray-100 pb-12">
                    <h1 className="text-6xl font-black tracking-tighter">Privacy Policy</h1>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">Current Version</span>
                        <span>Last updated: October 24, 2023</span>
                        <span>Effective: November 1, 2023</span>
                    </div>
                </header>

                <section className="space-y-8">
                    <div className="flex items-start gap-6">
                        <span className="w-10 h-10 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center shrink-0">1</span>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black">Introduction</h2>
                            <p className="text-gray-500 leading-relaxed">
                                Welcome to the Humble Halal ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at hello@humblehalal.sg.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        <span className="w-10 h-10 bg-gray-100 text-gray-400 font-black rounded-xl flex items-center justify-center shrink-0">2</span>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black">Information We Collect</h2>
                            <h3 className="text-xl font-bold">Personal Information You Disclose to Us</h3>
                            <p className="text-gray-500 leading-relaxed">
                                We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { t: 'Personal Information Provided by You', d: 'We collect names; phone numbers; email addresses; mailing addresses; job titles; usernames; passwords; contact preferences; contact or authentication data; billing addresses; debit/credit card numbers; and other similar information.' },
                                    { t: 'Payment Data', d: 'We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.' }
                                ].map(item => (
                                    <li key={item.t} className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="font-black text-sm">{item.t}.</p>
                                            <p className="text-sm text-gray-500">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        <span className="w-10 h-10 bg-gray-100 text-gray-400 font-black rounded-xl flex items-center justify-center shrink-0">3</span>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black">How We Use Your Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { t: 'Account Management', d: 'To facilitate account creation and logon process and manage user accounts.', icon: 'account_circle' },
                                    { t: 'Feedback & Support', d: 'To request feedback and to contact you about your use of our Website.', icon: 'chat' },
                                    { t: 'Security', d: 'To protect our Services and to respond to legal requests and prevent harm.', icon: 'verified_user' },
                                    { t: 'Marketing', d: 'To send you marketing and promotional communications (opt-out available).', icon: 'campaign' }
                                ].map(box => (
                                    <div key={box.t} className="p-6 bg-gray-50 rounded-[2rem] space-y-4">
                                        <span className="material-symbols-outlined text-primary">{box.icon}</span>
                                        <h4 className="font-black text-sm">{box.t}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{box.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-50 rounded-[2.5rem] p-12 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black">Contact Us</h2>
                        <p className="text-gray-500">If you have questions or comments about this policy, you may email us at hello@humblehalal.sg or by post to:</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm space-y-2">
                        <h4 className="font-black">Humble Halal</h4>
                        <p className="text-sm text-gray-500">123 Business Park Drive</p>
                        <p className="text-sm text-gray-500">Singapore 123456</p>
                        <p className="text-sm text-gray-500">Singapore</p>
                    </div>
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-200">
                        <div className="space-y-1">
                            <p className="font-black text-sm">Have more questions regarding compliance?</p>
                            <p className="text-xs text-gray-400">Our legal team is available Mon-Fri, 9am - 6pm SGT.</p>
                        </div>
                        <button className="bg-white border px-8 py-4 rounded-xl font-black text-sm shadow-sm hover:bg-gray-50 transition-all">Contact Legal Team</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPage;
