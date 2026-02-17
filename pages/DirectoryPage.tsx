
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { businesses } from '../services/db';
import { AIService } from '../services/api';
import { Category, Region, Business } from '../types';

type SortOption = 'rating' | 'newest' | 'reviews' | 'name';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'name', label: 'Name' },
];

const DirectoryPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
    const [selectedRegion, setSelectedRegion] = useState<string>(searchParams.get('region') || 'All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sort, setSort] = useState<SortOption>('rating');
    const [aiResult, setAiResult] = useState<{ text: string; sources: any[] } | null>(null);
    const [isSearchingAI, setIsSearchingAI] = useState(false);

    // Data state
    const [businessList, setBusinessList] = useState<Business[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const limit = 12;

    const fetchBusinesses = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await businesses.list({
                category: selectedCategory,
                region: selectedRegion,
                search: searchQuery,
                page,
                limit,
                sort,
            });
            setBusinessList(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Failed to fetch businesses:', error);
            setBusinessList([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, selectedRegion, searchQuery, page, sort]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, selectedRegion, searchQuery, sort]);

    const handleAISearch = async () => {
        if (!searchQuery) return;
        setIsSearchingAI(true);
        const result = await AIService.searchHalalStatusLive(searchQuery);
        setAiResult(result);
        setIsSearchingAI(false);
    };

    // Generate page numbers for pagination
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-8 shrink-0">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-tight">Search & Filter</h3>
                        <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Live AI Search</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search any restaurant..."
                                className="w-full rounded-xl border-gray-200 text-sm font-medium"
                            />
                            <button
                                onClick={handleAISearch}
                                disabled={isSearchingAI}
                                className="bg-charcoal text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-charcoal/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span className={`material-symbols-outlined text-sm ${isSearchingAI ? 'animate-spin' : ''}`}>auto_awesome</span>
                                {isSearchingAI ? 'Verifying...' : 'Verify with AI'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Categories</h4>
                        <div className="space-y-2">
                            {['All', ...Object.values(Category)].map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                        className="text-primary focus:ring-primary w-4 h-4 border-gray-300"
                                    />
                                    <span className={`text-sm ${selectedCategory === cat ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-charcoal'}`}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Region</h4>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full rounded-xl border-gray-200 text-sm font-bold"
                        >
                            <option value="All">All Regions</option>
                            {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* AI Live Results Section */}
                    {aiResult && (
                        <div className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-8 space-y-4 animate-in">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary font-black">auto_awesome</span>
                                    <h3 className="font-black text-lg">Gemini AI Live Verification</h3>
                                </div>
                                <button onClick={() => setAiResult(null)} className="material-symbols-outlined text-gray-400 hover:text-charcoal">close</button>
                            </div>
                            <p className="text-sm text-charcoal/80 leading-relaxed font-medium">{aiResult.text}</p>
                            {aiResult.sources.length > 0 && (
                                <div className="pt-4 border-t border-primary/10 flex flex-wrap gap-4">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sources:</span>
                                    {aiResult.sources.map((src, i) => (
                                        <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-primary hover:underline">
                                            {src.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
                        <h2 className="text-3xl font-black tracking-tight">Directory Results</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortOption)}
                                className="rounded-xl border-gray-200 text-xs font-bold uppercase tracking-wider py-2 px-3"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{total} results in local database</p>
                        </div>
                    </div>

                    {isLoading ? (
                        /* Loading Skeleton */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                            <div className="h-5 w-5 bg-gray-200 rounded-full" />
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <div key={j} className="h-4 w-4 bg-gray-200 rounded" />
                                            ))}
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded w-full" />
                                        <div className="pt-2 border-t border-gray-50 mt-2 pt-4">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : businessList.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {businessList.map(biz => (
                                    <Link to={`/business/${biz.slug ?? biz.id}`} key={biz.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                                        <div className="h-48 relative overflow-hidden">
                                            <img src={biz.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={biz.name} />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary text-charcoal text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                                                    {biz.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg leading-tight">{biz.name}</h3>
                                                {biz.isVerified && <span className="material-symbols-outlined text-primary text-lg filled">verified</span>}
                                            </div>
                                            <div className="flex items-center gap-1 text-accent">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`material-symbols-outlined text-sm ${i < Math.floor(biz.rating) ? 'filled' : ''}`}>star</span>
                                                ))}
                                                <span className="text-xs text-gray-400 ml-1">({biz.reviewCount})</span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium line-clamp-1">{biz.address}</p>
                                            <div className="pt-2 border-t border-gray-50 mt-2 pt-4">
                                                <span className="text-primary text-xs font-black uppercase tracking-widest group-hover:underline">View Details →</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-8">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-200 hover:bg-charcoal hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {getPageNumbers().map((pageNum, idx) =>
                                        pageNum === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-bold">...</span>
                                        ) : (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-xl text-sm font-black transition-colors ${
                                                    page === pageNum
                                                        ? 'bg-charcoal text-white'
                                                        : 'border border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-200 hover:bg-charcoal hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                            <h3 className="text-2xl font-black text-gray-400">No local matches found</h3>
                            <p className="text-gray-400 mt-2 font-medium">Try using the AI Verification tool on the sidebar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectoryPage;
