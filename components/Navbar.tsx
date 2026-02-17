
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark') ||
               localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Directory', path: '/directory', icon: 'search' },
        { name: 'Categories', path: '/categories', icon: 'category' },
        { name: 'Events', path: '/events', icon: 'event' },
        { name: 'Halal Living', path: '/living', icon: 'auto_stories' },
        { name: 'About', path: '/about', icon: 'info' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">storefront</span>
                        </div>
                        <span className="text-base font-black tracking-tight text-charcoal dark:text-white font-display">MyHumbleHalal</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-charcoal dark:hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/map" className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors" title="Map View">
                            <span className="material-symbols-outlined text-xl">map</span>
                        </Link>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-500 hover:text-charcoal dark:text-gray-400 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>

                        {user ? (
                            <div className="relative ml-1">
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black text-sm">{user.name.charAt(0).toUpperCase()}</div>
                                    <span className="text-sm font-bold text-charcoal dark:text-white hidden lg:block">{user.name}</span>
                                    <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                                                <p className="font-bold text-sm dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{user.subscription} plan</span>
                                            </div>
                                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span> Admin Panel
                                                </Link>
                                            )}
                                            <Link to="/submit-business" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <span className="material-symbols-outlined text-lg">add_business</span> Add Business
                                            </Link>
                                            <Link to="/submit-event" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <span className="material-symbols-outlined text-lg">event</span> Submit Event
                                            </Link>
                                            <div className="border-t border-gray-50 dark:border-gray-800 mt-1 pt-1">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="ml-1 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">Sign In</Link>
                        )}
                    </div>

                    <button className="lg:hidden p-2 text-charcoal dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800 px-4 py-4">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'text-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/map" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                            <span className="material-symbols-outlined text-lg">map</span> Map View
                        </Link>
                        <Link to="/support" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                            <span className="material-symbols-outlined text-lg">help</span> Support
                        </Link>
                    </div>
                    <div className="pt-4 mt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-lg font-bold bg-gray-50 dark:bg-gray-800 dark:text-white text-sm">Dashboard</Link>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-center py-3 rounded-lg font-bold text-red-500 bg-red-50 dark:bg-red-900/10 text-sm">Sign Out</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm">Sign In / Register</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
