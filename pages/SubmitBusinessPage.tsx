
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businesses } from '../services/db';
import { AIService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Category, Region } from '../types';

const SubmitBusinessPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>(Category.FOOD);
    const [region, setRegion] = useState<Region>(Region.CENTRAL);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; address?: string; category?: string }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = 'Business name is required.';
        if (!address.trim()) newErrors.address = 'Address is required.';
        if (!category) newErrors.category = 'Category is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAiGenerate = async () => {
        if (!name || !keywords) {
            alert("Please enter a Business Name and some Keywords first!");
            return;
        }
        setIsGenerating(true);
        const generated = await AIService.generateBusinessDescription(name, category, keywords);
        setDescription(generated || '');
        setIsGenerating(false);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!validate()) return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('You must be logged in to submit a business.');
            return;
        }
        setIsSubmitting(true);
        try {
            await businesses.create({
                name,
                category,
                region,
                address,
                phone,
                website,
                description,
                rating: 0,
                reviewCount: 0,
                imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
                status: 'Pending Review',
                submissionDate: new Date().toISOString().split('T')[0],
                ownerId: user.id,
            });
            navigate('/dashboard', { state: { success: 'Your business has been submitted and is pending review.' } });
        } catch (error) {
            console.error('Failed to submit business:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 -translate-y-1/2 rounded-full" />
            <div className={`absolute top-1/2 left-0 h-1 bg-primary -z-0 -translate-y-1/2 rounded-full transition-all duration-500`} style={{ width: `${(step - 1) * 50}%` }} />

            {[1, 2, 3].map(s => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-4 transition-all ${step >= s ? 'bg-primary border-primary text-charcoal shadow-lg' : 'bg-white border-gray-100 text-gray-300'}`}>
                        {s}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= s ? 'text-primary-dark' : 'text-gray-300'}`}>
                        {s === 1 ? 'Basic Info' : s === 2 ? 'AI Content' : 'Submission'}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center space-y-6 mb-20">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">List Your Halal <br /> Business</h1>
                <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Join Singapore's largest Halal directory and reach over 50,000 monthly active users.</p>
            </div>

            <StepIndicator />

            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl space-y-10">
                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Step 1: Business Details</h2>
                            <p className="text-sm text-gray-500 font-medium">Let's start with the basics. Please provide your business's core information.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Business Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                                    placeholder="e.g. Padi @ Bussorah"
                                    className={`w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm ${errors.name ? 'ring-2 ring-red-400' : ''}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs font-bold ml-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value as Category); if (errors.category) setErrors(prev => ({ ...prev, category: undefined })); }}
                                    className={`w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm appearance-none ${errors.category ? 'ring-2 ring-red-400' : ''}`}
                                >
                                    {Object.values(Category).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs font-bold ml-1">{errors.category}</p>}
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Region</label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value as Region)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm appearance-none"
                                >
                                    {Object.values(Region).map(reg => (
                                        <option key={reg} value={reg}>{reg}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. +65 6123 4567"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Full Address *</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors(prev => ({ ...prev, address: undefined })); }}
                                    placeholder="e.g. 53 Bussorah St, Singapore 199469"
                                    className={`w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm ${errors.address ? 'ring-2 ring-red-400' : ''}`}
                                    rows={3}
                                />
                                {errors.address && <p className="text-red-500 text-xs font-bold ml-1">{errors.address}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Website</label>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="e.g. https://www.mybusiness.com"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Step 2: AI-Powered Content</h2>
                            <p className="text-sm text-gray-500 font-medium">Use our Gemini-powered assistant to write a compelling description.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-primary/5 p-8 rounded-3xl space-y-6 border border-primary/10">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-charcoal/40 tracking-widest">Key Features (Keywords)</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="e.g. spicy sambal, cozy atmosphere, outdoor seating"
                                        className="w-full bg-white border-gray-100 rounded-xl py-4 px-6 font-bold text-sm shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleAiGenerate}
                                    disabled={isGenerating}
                                    className="bg-charcoal text-white px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-charcoal/20"
                                >
                                    <span className={`material-symbols-outlined text-primary ${isGenerating ? 'animate-spin' : ''}`}>auto_awesome</span>
                                    {isGenerating ? 'Generating Content...' : 'Generate with Gemini AI'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Business Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell us more about your business..."
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-6 px-8 font-bold text-sm leading-relaxed"
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Step 3: Review & Submit</h2>
                            <p className="text-sm text-gray-500 font-medium">Please review your business information before submitting.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-3xl p-8 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Business Name</p>
                                        <p className="text-sm font-bold text-charcoal">{name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</p>
                                        <p className="text-sm font-bold text-charcoal">{category}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Region</p>
                                        <p className="text-sm font-bold text-charcoal">{region}</p>
                                    </div>
                                    {phone && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</p>
                                            <p className="text-sm font-bold text-charcoal">{phone}</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2 space-y-1">
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Address</p>
                                        <p className="text-sm font-bold text-charcoal">{address}</p>
                                    </div>
                                    {website && (
                                        <div className="md:col-span-2 space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Website</p>
                                            <p className="text-sm font-bold text-charcoal">{website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {description && (
                                <div className="bg-gray-50 rounded-3xl p-8 space-y-3">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</p>
                                    <p className="text-sm font-bold text-charcoal leading-relaxed">{description}</p>
                                </div>
                            )}
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                <p className="text-xs font-bold text-charcoal/60">
                                    <span className="material-symbols-outlined text-primary text-sm align-middle mr-1">info</span>
                                    Your submission will be reviewed by our team before it goes live on the directory. You'll receive a notification once it's approved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-10 border-t border-gray-50 flex justify-between">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        className={`px-10 py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-widest ${step === 1 ? 'invisible' : 'bg-gray-100 text-charcoal hover:bg-gray-200'}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => step < 3 ? handleNext() : handleSubmit()}
                        disabled={isSubmitting}
                        className="bg-primary text-charcoal px-10 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 text-sm uppercase tracking-widest disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : step === 3 ? 'Confirm & Submit' : 'Continue'} <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitBusinessPage;
