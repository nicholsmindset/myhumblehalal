
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businesses, reviews as reviewsDb, users } from '../services/db';
import { AIService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Business, UserReview } from '../types';

const BusinessDetailPage: React.FC = () => {
    const { id } = useParams();
    const { user, refreshUser } = useAuth();

    const [business, setBusiness] = useState<Business | null>(null);
    const [reviewList, setReviewList] = useState<UserReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportComment, setReportComment] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    // Fetch business and reviews
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setIsLoading(true);
            const [biz, revs] = await Promise.all([
                businesses.getById(id),
                reviewsDb.listByBusiness(id),
            ]);
            setBusiness(biz);
            setReviewList(revs);
            setIsLoading(false);
        };
        loadData();
    }, [id]);

    // Determine bookmark state when user or business changes
    useEffect(() => {
        if (user && business) {
            setIsBookmarked(user.bookmarks?.includes(business.id) ?? false);
        }
    }, [user, business]);

    // AI vibe summary based on real reviews
    useEffect(() => {
        if (!business || reviewList.length === 0) {
            setAiSummary(null);
            return;
        }
        const loadAiSummary = async () => {
            setIsLoadingAI(true);
            const reviewTexts = reviewList.map(r => r.comment);
            const summary = await AIService.getAIVibeSummary(business.name, reviewTexts);
            setAiSummary(summary || "");
            setIsLoadingAI(false);
        };
        loadAiSummary();
    }, [business, reviewList]);

    const handleToggleBookmark = async () => {
        if (!user || !business) return;
        const newState = await users.toggleBookmark(user.id, business.id);
        setIsBookmarked(newState);
        await refreshUser();
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportReason) return alert("Please select a reason");
        setIsReporting(true);
        setTimeout(() => {
            alert("Thank you for your report. Our team will review this listing shortly.");
            setIsReporting(false);
            setIsReportModalOpen(false);
            setReportReason('');
            setReportComment('');
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Skeleton breadcrumbs */}
                <div className="flex items-center gap-3">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
                    <span className="text-gray-300">/</span>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                    <span className="text-gray-300">/</span>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                </div>
                {/* Skeleton gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] rounded-[2.5rem] overflow-hidden">
                    <div className="col-span-2 row-span-2 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="col-span-2 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                {/* Skeleton content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-charcoal/20 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-charcoal/20 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 h-64 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
                <span className="material-symbols-outlined text-6xl text-gray-300">search_off</span>
                <h1 className="text-3xl font-black tracking-tight dark:text-white">Business Not Found</h1>
                <p className="text-gray-400 font-medium">The listing you are looking for does not exist or has been removed.</p>
                <Link to="/directory" className="inline-block bg-primary text-charcoal px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/10">
                    Browse Directory
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Breadcrumbs */}
            <div className="flex items-center text-[10px] font-black uppercase text-gray-400 gap-3 tracking-[0.2em]">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link to="/directory" className="hover:text-primary transition-colors">Directory</Link>
                <span>/</span>
                <span className="text-charcoal dark:text-white/80">{business.name}</span>
            </div>

            {/* Hero Image */}
            <div className="h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img src={business.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={business.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <span className="bg-white/90 backdrop-blur-sm text-charcoal text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">{business.category}</span>
                    {business.isVerified && <span className="bg-emerald-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-sm filled">verified</span> Verified</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-white dark:bg-charcoal/20 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white">{business.name}</h1>
                                    {business.isVerified && <span className="material-symbols-outlined text-primary text-4xl filled">verified</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> {business.address}</span>
                                    <span className="bg-primary/10 text-primary px-4 py-1 rounded-full">{business.category}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-accent">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`material-symbols-outlined text-xl ${i < Math.round(business.rating) ? 'filled' : ''}`}>star</span>
                                        ))}
                                    </div>
                                    <span className="font-black text-xl dark:text-white">{business.rating}</span>
                                    <span className="text-gray-400 font-bold">({business.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleToggleBookmark}
                                    className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                    title={user ? (isBookmarked ? 'Remove from favorites' : 'Add to favorites') : 'Log in to bookmark'}
                                >
                                    <span className={`material-symbols-outlined ${isBookmarked ? 'filled text-red-500' : 'text-charcoal dark:text-white'}`}>favorite</span>
                                </button>
                                <button className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-charcoal dark:text-white hover:bg-primary/10 hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Vibe Summary Section */}
                    {reviewList.length > 0 && (
                        <div className="bg-charcoal text-white p-10 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-charcoal shadow-lg">
                                    <span className="material-symbols-outlined text-2xl font-black">auto_awesome</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">AI Vibe Summary</h2>
                            </div>
                            <div className="relative z-10">
                                {isLoadingAI ? (
                                    <div className="space-y-4">
                                        <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse" />
                                        <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse" />
                                        <div className="h-4 bg-white/10 rounded-full w-2/3 animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="text-gray-300 font-medium leading-relaxed whitespace-pre-line">
                                        {aiSummary}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">About {business.name}</h2>
                        <p className="text-gray-500 font-medium leading-relaxed text-lg dark:text-gray-400">
                            {business.description || "A wonderful establishment serving the local community with authentic halal choices. Known for its welcoming atmosphere and commitment to quality."}
                        </p>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white">Customer Reviews</h2>
                            <Link to={`/review/${business.id}`} className="bg-primary text-charcoal px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/10">
                                Write a Review
                            </Link>
                        </div>
                        <div className="space-y-8">
                            {reviewList.length === 0 ? (
                                <div className="bg-gray-50 dark:bg-charcoal/30 p-8 rounded-[2rem] text-center space-y-3">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">rate_review</span>
                                    <p className="text-gray-400 font-medium">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            ) : (
                                reviewList.map(review => (
                                    <div key={review.id} className="bg-gray-50 dark:bg-charcoal/30 p-8 rounded-[2rem] flex gap-6 hover:bg-white dark:hover:bg-charcoal/40 hover:shadow-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                        <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-gray-700 shadow-sm bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                            <span className="text-emerald-700 dark:text-emerald-400 font-black text-xl">{review.userName.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-black text-lg dark:text-white">{review.userName}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.date}</p>
                                                </div>
                                                <div className="flex items-center text-accent">
                                                    {[...Array(5)].map((_, j) => (
                                                        <span key={j} className={`material-symbols-outlined text-sm ${j < review.rating ? 'filled' : ''}`}>star</span>
                                                    ))}
                                                </div>
                                            </div>
                                            {review.title && (
                                                <h5 className="font-bold text-sm dark:text-white">{review.title}</h5>
                                            )}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                                {review.comment}
                                            </p>
                                            {review.vibeTags && review.vibeTags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {review.vibeTags.map(tag => (
                                                        <span key={tag} className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-charcoal/20 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                        <h3 className="text-2xl font-black tracking-tight dark:text-white">Visit Details</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <p className="font-black text-sm dark:text-white">Opening Hours</p>
                                    <p className="text-xs text-gray-400 font-medium mt-1">{business.openingHours || 'Contact for hours'}</p>
                                </div>
                            </div>
                            {business.phone && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-sm dark:text-white">Contact</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">{business.phone}</p>
                                    </div>
                                </div>
                            )}
                            {business.website && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined">language</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-sm dark:text-white">Website</p>
                                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium mt-1 hover:underline block">
                                            {business.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-primary text-charcoal font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                            <span className="material-symbols-outlined">directions</span>
                            Get Directions
                        </button>

                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="w-full text-red-500 font-black py-4 rounded-xl border border-red-500/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">flag</span>
                            Report Listing
                        </button>
                    </div>

                    <div className="rounded-[2.5rem] overflow-hidden h-64 border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                         <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100" alt="Map" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-100">
                                <span className="material-symbols-outlined text-primary text-3xl filled">location_on</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setIsReportModalOpen(false)} />
                    <div className="bg-white dark:bg-charcoal rounded-[3rem] w-full max-w-xl p-10 space-y-8 relative z-10 shadow-3xl animate-in scale-in">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white">Report Business</h2>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">Is there something wrong with this listing? Help us keep the directory accurate.</p>
                        </div>

                        <form onSubmit={handleReportSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reason for Report</label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl py-4 px-6 text-sm font-bold dark:text-white"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Closed Permanently">Closed Permanently</option>
                                    <option value="Not Halal Certified">Not Halal Certified</option>
                                    <option value="Incorrect Information">Incorrect Information</option>
                                    <option value="Duplicate Listing">Duplicate Listing</option>
                                    <option value="Offensive Content">Offensive Content</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Additional Details</label>
                                <textarea
                                    value={reportComment}
                                    onChange={(e) => setReportComment(e.target.value)}
                                    placeholder="Please provide more details..."
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl py-6 px-8 text-sm font-bold min-h-[120px] dark:text-white"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isReporting}
                                    className="flex-1 bg-primary text-charcoal py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    {isReporting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessDetailPage;
