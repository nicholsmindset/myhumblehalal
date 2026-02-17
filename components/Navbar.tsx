
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
        { name: 'Browse Categories', path: '/categories' },
        { name: 'About Us', path: '/about' },
        { name: 'Add Your Business', path: '/submit-business' },
        { name: 'Contact', path: '/support' },
    ];

    const handleLogout = async () => {
        await logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <div className="h-8 w-8 text-[#006A4E]">
                             <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-charcoal dark:text-white font-display">Singapore Halal <span className="text-[#006A4E] font-black">Business Directory</span></h1>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="text-sm font-semibold text-charcoal/80 dark:text-white/80 hover:text-[#006A4E] dark:hover:text-primary transition-colors">{link.name}</Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-charcoal dark:text-white">
                            <span className="material-symbols-outlined text-2xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>

                        {user ? (
                            <div className="relative">
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-black text-sm">{user.name.charAt(0).toUpperCase()}</div>
                                    <span className="text-sm font-bold text-charcoal dark:text-white hidden lg:block">{user.name}</span>
                                    <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden">
                                            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800">
                                                <p className="font-bold text-sm dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary-dark">{user.subscription} plan</span>
                                            </div>
                                            <Link to="/dashboard" className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span> Admin Panel
                                                </Link>
                                            )}
                                            <Link to="/submit-business" className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <span className="material-symbols-outlined text-lg">add_business</span> Add Business
                                            </Link>
                                            <div className="border-t border-gray-50 dark:border-gray-800 mt-1 pt-1">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold text-charcoal dark:text-white">Login</Link>
                                <Link to="/login" className="bg-[#006A4E] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#005a3f] transition-all">Sign In / Register</Link>
                            </>
                        )}
                    </div>

                    <button className="lg:hidden p-2 text-charcoal dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800 px-4 py-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-charcoal dark:text-white">{link.name}</Link>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-md font-bold bg-gray-50 dark:bg-gray-800 dark:text-white">Dashboard</Link>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-center py-3 rounded-md font-bold text-red-500 bg-red-50 dark:bg-red-900/10">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-md font-bold bg-gray-50 dark:bg-gray-800 dark:text-white">Login</Link>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center bg-[#006A4E] text-white py-3 rounded-md font-bold">Sign In / Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
