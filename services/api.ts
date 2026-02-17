/**
 * AI Service - Google Gemini integration.
 *
 * Improvements:
 *  - Retry with exponential backoff (up to 3 attempts)
 *  - In-memory response cache with TTL (5 minutes)
 *  - Input length validation (max 500 chars for queries)
 *
 * These are separate from the database layer and continue to work
 * the same way after Supabase migration.
 *
 * API key is injected at build time by vite.config.ts:
 *   define: { 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY) }
 */

import { GoogleGenAI } from "@google/genai";

// Injected by vite.config.ts at build time (see define block)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY ?? '' });

// ── Constants ──

const MAX_RETRIES = 2; // 3 total attempts
const RETRY_BASE_MS = 1000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_QUERY_LENGTH = 500;

// ── Response cache ──

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── Retry helper ──

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt)));
            }
        }
    }
    throw lastError;
}

// ── Input validation ──

function truncateQuery(query: string): string {
    const trimmed = query.trim();
    return trimmed.length > MAX_QUERY_LENGTH ? trimmed.slice(0, MAX_QUERY_LENGTH) : trimmed;
}

// ── Public API ──

interface SearchResult {
    text: string;
    sources: Array<{ title: string; uri: string }>;
}

export const AIService = {
    searchHalalStatusLive: async (query: string): Promise<SearchResult> => {
        const safeQuery = truncateQuery(query);
        if (safeQuery.length === 0) {
            return { text: "Please enter a search query.", sources: [] };
        }

        const cacheKey = `search:${safeQuery.toLowerCase()}`;
        const cached = getCached<SearchResult>(cacheKey);
        if (cached) return cached;

        try {
            const result = await withRetry(async () => {
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: `Is "${safeQuery}" Halal certified or Muslim-owned in Singapore? Provide current status and a brief reason.`,
                    config: { tools: [{ googleSearch: {} }] },
                });
                const text = response.text || "No information found.";
                const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                const sources = groundingChunks
                    .filter((chunk: any) => chunk.web?.uri)
                    .map((chunk: any) => ({ title: chunk.web?.title || "Source", uri: chunk.web?.uri || "" }));
                return { text, sources };
            });

            setCache(cacheKey, result);
            return result;
        } catch (error) {
            console.error("Live Search Error:", error);
            return { text: "Search service temporarily unavailable.", sources: [] };
        }
    },

    getAIVibeSummary: async (businessName: string, reviews: string[]): Promise<string | undefined> => {
        const safeName = truncateQuery(businessName);
        if (reviews.length === 0) return "No reviews to summarize.";

        const cacheKey = `vibe:${safeName.toLowerCase()}:${reviews.length}`;
        const cached = getCached<string>(cacheKey);
        if (cached) return cached;

        try {
            const result = await withRetry(async () => {
                // Cap review text to prevent oversized prompts
                const reviewText = reviews.slice(0, 20).join(' | ').slice(0, 2000);
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: `You are a food critic. Summarize the overall "vibe", "service quality", and "must-order dishes" for ${safeName} based on these reviews: ${reviewText}. Return 3 concise bullet points.`,
                });
                return response.text;
            });

            if (result) setCache(cacheKey, result);
            return result;
        } catch {
            return "Vibe summary currently generating...";
        }
    },

    generateBusinessDescription: async (name: string, category: string, keywords: string): Promise<string | undefined> => {
        const safeName = truncateQuery(name);
        const safeCategory = truncateQuery(category);
        const safeKeywords = truncateQuery(keywords);

        try {
            const result = await withRetry(async () => {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: `Write a professional 80-word business description for a Halal directory. Name: ${safeName}, Category: ${safeCategory}, Keywords: ${safeKeywords}.`,
                });
                return response.text;
            });
            return result;
        } catch {
            return "Error generating description.";
        }
    }
};
