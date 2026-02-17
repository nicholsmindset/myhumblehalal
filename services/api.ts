
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI-powered features using Google Gemini.
 * These are separate from the database layer and continue to work
 * the same way after Supabase migration.
 */
export const AIService = {
    searchHalalStatusLive: async (query: string) => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Is "${query}" Halal certified or Muslim-owned in Singapore? Provide current status and a brief reason.`,
                config: { tools: [{ googleSearch: {} }] },
            });
            const text = response.text || "No information found.";
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const sources = groundingChunks
                .filter((chunk: any) => chunk.web?.uri)
                .map((chunk: any) => ({ title: chunk.web?.title || "Source", uri: chunk.web?.uri || "" }));
            return { text, sources };
        } catch (error) {
            console.error("Live Search Error:", error);
            return { text: "Search service temporarily unavailable.", sources: [] };
        }
    },

    getAIVibeSummary: async (businessName: string, reviews: string[]) => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
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
                model: 'gemini-2.0-flash',
                contents: `Write a professional 80-word business description for a Halal directory. Name: ${name}, Category: ${category}, Keywords: ${keywords}.`,
            });
            return response.text;
        } catch (error) {
            return "Error generating description.";
        }
    }
};
