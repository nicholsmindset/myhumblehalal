
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">storefront</span>
                            </div>
                            <span className="text-base font-black text-white font-display">MyHumbleHalal</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">Singapore's trusted Halal business directory. Discover certified eateries, services, and shops.</p>
                        <div className="flex gap-3 pt-2">
                            {['facebook', 'twitter', 'instagram'].map(platform => (
                                <a key={platform} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                                    <img src={`https://cdn.simpleicons.org/${platform}/ffffff`} className="w-4 h-4" alt={platform} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Explore</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link to="/directory" className="text-sm hover:text-emerald-400 transition-colors">Browse Directory</Link>
                            <Link to="/categories" className="text-sm hover:text-emerald-400 transition-colors">Categories</Link>
                            <Link to="/map" className="text-sm hover:text-emerald-400 transition-colors">Map View</Link>
                            <Link to="/events" className="text-sm hover:text-emerald-400 transition-colors">Events</Link>
                            <Link to="/living" className="text-sm hover:text-emerald-400 transition-colors">Halal Living</Link>
                        </div>
                    </div>

                    {/* For Business */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">For Business</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link to="/submit-business" className="text-sm hover:text-emerald-400 transition-colors">Add Your Business</Link>
                            <Link to="/submit-event" className="text-sm hover:text-emerald-400 transition-colors">Submit Event</Link>
                            <Link to="/advertise" className="text-sm hover:text-emerald-400 transition-colors">Advertise</Link>
                            <Link to="/checkout" className="text-sm hover:text-emerald-400 transition-colors">Pricing Plans</Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Company</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link to="/about" className="text-sm hover:text-emerald-400 transition-colors">About Us</Link>
                            <Link to="/support" className="text-sm hover:text-emerald-400 transition-colors">Contact / Support</Link>
                            <Link to="/privacy" className="text-sm hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                            <Link to="/login" className="text-sm hover:text-emerald-400 transition-colors">Sign In</Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} MyHumbleHalal. All rights reserved.</p>
                    <p className="text-xs text-gray-500">Made with care for the Singapore Muslim community</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
