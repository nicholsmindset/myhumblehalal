
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { businesses, reviews } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Business } from '../types';

const ReviewPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

    useEffect(() => {
        if (!id) return;
        businesses.getById(id).then((biz) => {
            setBusiness(biz);
            setLoading(false);
        });
    }, [id]);

    const validate = (): boolean => {
        const newErrors: { rating?: string; comment?: string } = {};
        if (rating === 0) {
            newErrors.rating = 'Please select a star rating.';
        }
        if (comment.length < 50) {
            newErrors.comment = `Review must be at least 50 characters (currently ${comment.length}).`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || !business || !user) return;
        setSubmitting(true);
        try {
            await reviews.create({
                businessId: business.id,
                businessName: business.name,
                userId: user.id,
                userName: user.name,
                rating,
                comment,
                title,
                date: new Date().toISOString().split('T')[0],
                vibeTags: [],
            });
            navigate(`/business/${business.id}`, { state: { message: 'Your review has been submitted successfully!' } });
        } catch {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-gray-200">error</span>
                    <p className="text-lg font-bold text-gray-400">Business not found.</p>
                    <Link to="/directory" className="text-primary font-bold hover:underline">Back to Directory</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
            <header className="space-y-10">
                <div className="flex items-center text-[10px] font-black uppercase text-gray-400 gap-3 tracking-[0.2em]">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="text-gray-300">/</span>
                    <Link to="/directory" className="hover:text-primary transition-colors">Restaurants</Link>
                    <span className="text-gray-300">/</span>
                    <Link to={`/business/${business.id}`} className="hover:text-primary transition-colors">{business.name}</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-charcoal">Write a Review</span>
                </div>
                <div className="space-y-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">How was your <br /> experience?</h1>
                    <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto">Your review helps others find the best Halal spots in Singapore. Be honest and descriptive.</p>
                </div>
            </header>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
                {/* Context Card Header */}
                <div className="p-10 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg shrink-0">
                        <img src={business.imageUrl} className="w-full h-full object-cover" alt={business.name} />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">YOU ARE REVIEWING</p>
                        <h2 className="text-3xl font-black tracking-tight">{business.name}</h2>
                        <p className="text-sm text-gray-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span> {business.address}
                        </p>
                    </div>
                </div>

                {/* Star Rating Section */}
                <div className="p-12 space-y-16">
                    <div className="text-center space-y-6">
                        <h3 className="font-black text-2xl tracking-tight">Rate your overall experience</h3>
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => { setRating(star); setErrors(prev => ({ ...prev, rating: undefined })); }}
                                    className="p-1 group focus:outline-none transition-transform active:scale-90"
                                >
                                    <span className={`material-symbols-outlined text-6xl md:text-7xl transition-all duration-300 ${star <= rating ? 'text-accent filled' : 'text-gray-100 group-hover:text-accent/30'}`}>
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                        {errors.rating ? (
                            <p className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">{errors.rating}</p>
                        ) : (
                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Click the stars to rate</p>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Inputs */}
                    <div className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Review Title</label>
                            <input
                                type="text"
                                placeholder="What's the most important thing to know?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-5 px-8 rounded-2xl text-sm font-bold placeholder:text-gray-300 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Your Review</label>
                            <textarea
                                placeholder="Tell us about the food, service, and atmosphere. Was the food spicy? Was the service fast?"
                                value={comment}
                                onChange={(e) => { if (e.target.value.length <= 2000) { setComment(e.target.value); setErrors(prev => ({ ...prev, comment: undefined })); } }}
                                className={`w-full bg-gray-50 border-0 focus:ring-2 ring-primary py-8 px-8 rounded-3xl text-sm font-bold min-h-[250px] placeholder:text-gray-300 transition-all leading-relaxed ${errors.comment ? 'ring-2 ring-red-400' : ''}`}
                            />
                            <div className="flex justify-between items-center px-1">
                                {errors.comment ? (
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.comment}</span>
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Min 50 characters</span>
                                )}
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${comment.length >= 2000 ? 'text-red-400' : comment.length >= 50 ? 'text-green-400' : 'text-gray-300'}`}>{comment.length} / 2000</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Add Photos <span className="lowercase text-[10px] font-medium opacity-50 ml-2">(Optional)</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary group transition-all">
                                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-charcoal transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-charcoal transition-colors">Click to upload</span>
                                </div>
                                {[1, 2].map(i => (
                                    <div key={i} className="aspect-square bg-gray-50/50 border-2 border-gray-100/50 rounded-[2rem] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-100 text-5xl">image</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">Formats: JPG, PNG. Max size: 5MB per image.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-primary text-charcoal font-black py-6 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'} <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">{submitting ? 'hourglass_empty' : 'arrow_forward'}</span>
                    </button>
                </div>
            </div>

            <footer className="text-center pt-20 pb-10 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">&copy; {new Date().getFullYear()} Humble Halal. All rights reserved.</p>
                <div className="flex justify-center gap-10">
                    {['Terms of Service', 'Privacy Policy', 'Review Guidelines'].map(l => (
                        <Link key={l} to="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-charcoal transition-colors">{l}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default ReviewPage;
