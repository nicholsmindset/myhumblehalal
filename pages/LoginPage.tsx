
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isLogin) {
            const { error } = await login(email, password);
            if (error) { setError(error); return; }
        } else {
            if (!name.trim()) { setError('Please enter your name.'); return; }
            const { error } = await register(email, password, name);
            if (error) { setError(error); return; }
        }
        navigate(from, { replace: true });
    };

    const fillDemo = (type: 'user' | 'admin' | 'owner') => {
        const creds = {
            user: { email: 'ahmad@example.com', password: 'password123' },
            admin: { email: 'admin@humblehalal.sg', password: 'admin123' },
            owner: { email: 'owner@example.com', password: 'owner123' },
        };
        setEmail(creds[type].email);
        setPassword(creds[type].password);
        setIsLogin(true);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-10 bg-gray-50">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col lg:row md:flex-row min-h-[850px]">
                <div className="w-full md:w-[45%] relative bg-charcoal overflow-hidden group shrink-0">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover brightness-[0.4] transition-transform duration-[3s] group-hover:scale-110" alt="Halal Dining Experience" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-20 space-y-10">
                        <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20">
                            <span className="material-symbols-outlined text-charcoal text-3xl filled">verified</span>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">Discover Halal Dining Excellence</h2>
                            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">Join the largest community of halal food lovers in Singapore.</p>
                        </div>
                        <div className="pt-10 flex items-center gap-6 border-t border-white/10">
                            <div className="flex -space-x-5">
                                {['A', 'S', 'N'].map((initial, i) => (
                                    <div key={i} className="w-14 h-14 rounded-full border-[6px] border-charcoal bg-emerald-700 flex items-center justify-center shadow-2xl">
                                        <span className="text-white font-black text-lg">{initial}</span>
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

                <div className="w-full md:w-[55%] p-10 md:p-24 flex flex-col justify-center space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{isLogin ? <>Welcome <br /> Back</> : <>Create <br /> Account</>}</h1>
                        <p className="text-gray-400 text-lg font-medium">{isLogin ? 'Please enter your details to access your account.' : 'Join the Halal community in Singapore.'}</p>
                    </div>

                    <div className="space-y-10">
                        <div className="flex bg-gray-100 rounded-2xl p-2 max-w-md">
                            <button onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${isLogin ? 'bg-white text-charcoal shadow-xl' : 'text-gray-400 hover:text-charcoal'}`}>Log In</button>
                            <button onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${!isLogin ? 'bg-white text-charcoal shadow-xl' : 'text-gray-400 hover:text-charcoal'}`}>Sign Up</button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">error</span> {error}
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest self-center mr-2">Quick demo:</span>
                                {([['User', 'user'], ['Business Owner', 'owner'], ['Admin', 'admin']] as const).map(([label, type]) => (
                                    <button key={type} onClick={() => fillDemo(type)} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-primary hover:text-primary transition-all">{label}</button>
                                ))}
                            </div>
                        )}

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative">
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ahmad Hassan" className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold transition-all" />
                                        <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-gray-300">person</span>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative">
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold transition-all" />
                                    <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-gray-300">mail</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold transition-all" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-charcoal transition-colors">{showPassword ? 'visibility_off' : 'visibility'}</button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-charcoal font-black py-6 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest disabled:opacity-50">
                                {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'} <span className="material-symbols-outlined">arrow_right_alt</span>
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
