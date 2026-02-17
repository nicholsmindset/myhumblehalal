
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const navLinks = [
        { name: 'Browse Categories', path: '/categories' },
        { name: 'About Us', path: '/about' },
        { name: 'Add Your Business', path: '/submit-business' },
        { name: 'Contact', path: '/support' },
    ];

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
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-semibold text-charcoal/80 dark:text-white/80 hover:text-[#006A4E] dark:hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-charcoal dark:text-white"
                        >
                            <span className="material-symbols-outlined text-2xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <Link to="/login" className="text-sm font-bold text-charcoal dark:text-white">
                            Login
                        </Link>
                        <Link to="/submit-business" className="bg-[#006A4E] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#005a3f] transition-all">
                            Sign In / Register
                        </Link>
                    </div>

                    <button className="lg:hidden p-2 text-charcoal dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-charcoal border-b border-gray-100 dark:border-gray-800 px-4 py-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-lg font-bold text-charcoal dark:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 rounded-md font-bold bg-gray-50 dark:bg-gray-800 dark:text-white">
                            Login
                        </Link>
                        <Link to="/submit-business" onClick={() => setIsMenuOpen(false)} className="w-full text-center bg-[#006A4E] text-white py-3 rounded-md font-bold">
                            Sign In / Register
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
