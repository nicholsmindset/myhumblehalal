
import { GoogleGenAI } from "@google/genai";
import { Business, UserReview, SubmissionStatus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock Database Initial State (Simulated Production DB)
const INITIAL_BUSINESSES: Business[] = [
    {
        id: "b1",
        name: "Hassan's Kitchen",
        category: "Food & Beverage" as any,
        address: "123 Kampong Glam",
        region: "Central Region" as any,
        rating: 4.5,
        reviewCount: 12,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
        status: 'Approved',
        submissionDate: '15 Oct 2023'
    }
];

const INITIAL_REVIEWS: UserReview[] = [
    {
        id: "r1",
        businessId: "1",
        businessName: "Delicious Bites Cafe",
        userName: "Ahmad Hassan",
        rating: 4,
        comment: "The nasi lemak was incredible! Authentic taste and the sambal had the perfect amount of spice. Will definitely be back.",
        date: "5 days ago"
    }
];

export const BackendService = {
    getUserSubmissions: () => {
        const stored = localStorage.getItem('halal_submissions');
        return stored ? JSON.parse(stored) : INITIAL_BUSINESSES;
    },

    getUserReviews: () => {
        const stored = localStorage.getItem('halal_reviews');
        return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    },

    // AI Feature: Live Halal Verification using Google Search Grounding
    searchHalalStatusLive: async (query: string) => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-pro-preview",
                contents: `Is "${query}" Halal certified or Muslim-owned in Singapore? Provide current status and a brief reason.`,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const text = response.text || "No information found.";
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            
            // Extract unique URLs from grounding chunks for transparency
            const sources = groundingChunks
                .filter(chunk => chunk.web?.uri)
                .map(chunk => ({
                    title: chunk.web?.title || "Source",
                    uri: chunk.web?.uri || ""
                }));

            return { text, sources };
        } catch (error) {
            console.error("Live Search Error:", error);
            return { text: "Search service temporarily unavailable.", sources: [] };
        }
    },

    // AI Feature: Review Summarizer
    getAIVibeSummary: async (businessName: string, reviews: string[]) => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `You are a food critic. Summarize the overall "vibe", "service quality", and "must-order dishes" for ${businessName} based on these reviews: ${reviews.join(' | ')}. Return 3 concise bullet points.`,
            });
            return response.text;
        } catch (error) {
            return "Vibe summary currently generating...";
        }
    },

    generateBusinessDescription: async (name: string, category: string, keywords: string) => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Write a professional 80-word business description for a Halal directory. Name: ${name}, Category: ${category}, Keywords: ${keywords}.`,
            });
            return response.text;
        } catch (error) {
            return "Error generating description.";
        }
    }
};
