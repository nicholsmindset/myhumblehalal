
import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-10 bg-gray-50">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col lg:row md:flex-row min-h-[850px]">
                {/* Brand Showcase Side */}
                <div className="w-full md:w-[45%] relative bg-charcoal overflow-hidden group shrink-0">
                    <img 
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover brightness-[0.4] transition-transform duration-[3s] group-hover:scale-110" 
                        alt="Halal Dining Experience" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-20 space-y-10">
                        <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20">
                            <span className="material-symbols-outlined text-charcoal text-3xl filled">verified</span>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">Discover Halal Dining Excellence</h2>
                            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                                Join the largest community of halal food lovers in Singapore. Find, review, and share your favorite spots with thousands of users.
                            </p>
                        </div>
                        <div className="pt-10 flex items-center gap-6 border-t border-white/10">
                            <div className="flex -space-x-5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-full border-[6px] border-charcoal bg-gray-800 overflow-hidden shadow-2xl">
                                        <img src={`https://i.pravatar.cc/150?u=user${i+10}`} className="w-full h-full object-cover" alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xl font-black text-white tracking-tight">12k+ Foodies</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Joined this month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Authentication Form Side */}
                <div className="w-full md:w-[55%] p-10 md:p-24 flex flex-col justify-center space-y-16">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Welcome <br /> Back</h1>
                        <p className="text-gray-400 text-lg font-medium">Please enter your details to access your account.</p>
                    </div>

                    <div className="space-y-10">
                        <div className="flex bg-gray-100 rounded-2xl p-2 max-w-md">
                            <button className="flex-1 bg-white text-charcoal py-4 rounded-xl font-black text-sm shadow-xl transition-all">Log In</button>
                            <button className="flex-1 text-gray-400 py-4 rounded-xl font-black text-sm hover:text-charcoal transition-all">Sign Up</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="w-full py-5 border-2 border-gray-50 rounded-2xl flex items-center justify-center gap-3 font-black text-sm hover:bg-gray-50 hover:border-gray-100 transition-all shadow-sm">
                                <img src="https://cdn.simpleicons.org/google/13ec80" className="w-5 h-5" alt="google" />
                                Continue with Google
                            </button>
                            <button className="w-full py-5 border-2 border-gray-50 rounded-2xl flex items-center justify-center gap-3 font-black text-sm hover:bg-gray-50 hover:border-gray-100 transition-all shadow-sm">
                                <img src="https://cdn.simpleicons.org/facebook/13ec80" className="w-5 h-5" alt="facebook" />
                                Continue with Facebook
                            </button>
                        </div>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t-2 border-gray-50"></div>
                            <span className="flex-shrink mx-6 text-[11px] font-black uppercase text-gray-300 tracking-[0.4em]">OR</span>
                            <div className="flex-grow border-t-2 border-gray-50"></div>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-gray-300">mail</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-charcoal transition-colors">visibility</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-gray-200" />
                                    <span className="text-xs font-black text-gray-400 group-hover:text-charcoal transition-colors uppercase tracking-widest">Remember me</span>
                                </label>
                                <button className="text-xs font-black text-charcoal hover:underline uppercase tracking-widest">Forgot Password?</button>
                            </div>

                            <button className="w-full bg-primary text-charcoal font-black py-6 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
                                Log In <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </form>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-[0.2em] leading-relaxed">
                        By continuing, you agree to our <Link to="/privacy" className="text-charcoal underline hover:text-primary transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-charcoal underline hover:text-primary transition-colors">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
