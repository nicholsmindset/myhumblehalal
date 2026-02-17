
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#f8faf9] dark:bg-charcoal border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs text-gray-500 font-medium">© 2024 Singapore Halal Business Directory. All Rights Reserved.</p>
                    
                    <div className="flex gap-8 text-xs font-bold text-gray-500">
                        <Link to="/privacy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
                        <Link to="/privacy" className="hover:text-charcoal transition-colors">Terms of Service</Link>
                        <Link to="/support" className="hover:text-charcoal transition-colors">FAQ</Link>
                    </div>

                    <div className="flex gap-4">
                        {['facebook', 'twitter', 'instagram'].map(platform => (
                            <a key={platform} href="#" className="text-gray-500 hover:text-charcoal transition-colors">
                                <img src={`https://cdn.simpleicons.org/${platform}/666666`} className="w-5 h-5 dark:invert opacity-70" alt={platform} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
