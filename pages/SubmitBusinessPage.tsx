
import React, { useState } from 'react';
import { BackendService } from '../services/api';

const SubmitBusinessPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('F&B');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAiGenerate = async () => {
        if (!name || !keywords) {
            alert("Please enter a Business Name and some Keywords first!");
            return;
        }
        setIsGenerating(true);
        const generated = await BackendService.generateBusinessDescription(name, category, keywords);
        setDescription(generated || '');
        setIsGenerating(false);
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
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Business Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Padi @ Bussorah" 
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm appearance-none"
                                >
                                    <option>Food & Beverage</option>
                                    <option>Retail & Shopping</option>
                                    <option>Health & Wellness</option>
                                    <option>Professional Services</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Full Address</label>
                                <textarea placeholder="e.g. 53 Bussorah St, Singapore 199469" className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-2 ring-primary py-4 px-6 font-bold text-sm" rows={3} />
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

                <div className="pt-10 border-t border-gray-50 flex justify-between">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        className={`px-10 py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-widest ${step === 1 ? 'invisible' : 'bg-gray-100 text-charcoal hover:bg-gray-200'}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : alert('Submitted!')}
                        className="bg-primary text-charcoal px-10 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center gap-3 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        {step === 3 ? 'Confirm & Submit' : 'Continue'} <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitBusinessPage;
