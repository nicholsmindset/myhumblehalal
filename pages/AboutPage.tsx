
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-24">
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">About <br /> Humble Halal</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Your trusted guide to discovering and supporting Halal-certified businesses across Singapore.</p>
                <div className="pt-8 h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1525625232717-1c28c31a6132?auto=format&fit=crop&q=80&w=800" 
                        className="w-full h-full object-cover" 
                        alt="Singapore Halal Excellence" 
                    />
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                        To seamlessly connect the community with a comprehensive and trusted network of Halal-certified establishments in Singapore. We aim to empower consumers to make informed choices.
                    </p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                        To be the most comprehensive and indispensable resource for Halal choices in Singapore, fostering a vibrant and accessible Halal ecosystem for everyone.
                    </p>
                </div>
            </section>

            <section className="space-y-12">
                <h2 className="text-4xl font-bold text-center">Our Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Trust', icon: 'verified', desc: 'Accurate and verified information.' },
                        { title: 'Community', icon: 'groups', desc: 'Connecting consumers and businesses.' },
                        { title: 'Authenticity', icon: 'check_circle', desc: 'Adhering to genuine Halal principles.' },
                        { title: 'Accessibility', icon: 'accessibility_new', desc: 'Easy finding for everyone, anywhere.' }
                    ].map(val => (
                        <div key={val.title} className="bg-white dark:bg-charcoal/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-4 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-3xl filled">{val.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold">{val.title}</h3>
                            <p className="text-sm text-gray-500">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
