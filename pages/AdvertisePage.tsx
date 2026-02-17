
import React from 'react';
import { Link } from 'react-router-dom';

const AdvertisePage: React.FC = () => {
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            desc: 'Get your business listed on our directory.',
            features: ['Standard Listing', 'Basic Info', 'Location on Map', '1 Photo'],
            cta: 'Start for Free',
            featured: false
        },
        {
            name: 'Premium',
            price: '$49',
            period: '/mo',
            desc: 'Increase your visibility and stand out.',
            features: ['Featured Placement', 'Verified Badge', 'Up to 10 Photos', 'Analytics Dashboard', 'Social Media Shoutout'],
            cta: 'Go Premium',
            featured: true
        },
        {
            name: 'Corporate',
            price: '$199',
            period: '/mo',
            desc: 'Maximum exposure for larger chains.',
            features: ['Top Hero Placement', 'Multi-location Support', 'Priority Support', 'Full Content Creation', 'Email Newsletter Feature'],
            cta: 'Contact Sales',
            featured: false
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight">Grow Your Halal <br /> Business</h1>
                <p className="text-xl text-gray-500">Reach thousands of active halal-conscious consumers in Singapore every day.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.name} className={`relative p-8 rounded-3xl border flex flex-col gap-8 transition-all hover:scale-105 ${plan.featured ? 'bg-charcoal text-white border-primary shadow-2xl scale-105' : 'bg-white dark:bg-charcoal/20 border-gray-100 dark:border-gray-800'}`}>
                        {plan.featured && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-charcoal px-4 py-1 rounded-full text-xs font-black uppercase">Most Popular</span>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">{plan.price}</span>
                                {plan.period && <span className="text-sm opacity-60">{plan.period}</span>}
                            </div>
                            <p className="text-sm opacity-70">{plan.desc}</p>
                        </div>
                        <ul className="flex-1 space-y-4">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm">
                                    <span className={`material-symbols-outlined text-sm ${plan.featured ? 'text-primary' : 'text-primary'}`}>check_circle</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link to={plan.price === 'Free' ? '/submit-business' : `/checkout?plan=${plan.name.toLowerCase()}`} className={`w-full py-4 rounded-xl font-bold text-center block transition-all ${plan.featured ? 'bg-primary text-charcoal hover:bg-primary/90' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'}`}>
                            {plan.cta}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdvertisePage;
