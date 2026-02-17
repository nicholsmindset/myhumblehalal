
import { Business, Category, Region, Event } from './types';

export const MOCK_BUSINESSES: Business[] = [
    {
        id: "1",
        name: "The Coconut Club",
        category: Category.FOOD,
        address: "269 Beach Rd, Singapore 199546",
        region: Region.CENTRAL,
        rating: 4.9,
        reviewCount: 128,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
        description: "Signature Nasi Lemak and authentic Malay cuisine in a colonial-style setting.",
        isVerified: true,
        isFeatured: true
    },
    {
        id: "2",
        name: "Hjh Maimunah",
        category: Category.FOOD,
        address: "11 Jalan Pisang, Singapore 199078",
        region: Region.CENTRAL,
        rating: 4.5,
        reviewCount: 84,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
        isVerified: true,
        isFeatured: true
    },
    {
        id: "3",
        name: "The Green Table",
        category: Category.HEALTH,
        address: "101 Thomson Rd, Singapore",
        region: Region.CENTRAL,
        rating: 4.2,
        reviewCount: 45,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
        isVerified: true
    }
];

export const MOCK_EVENTS: Event[] = [
    {
        id: "e1",
        title: "Geylang Serai Ramadan Bazaar 2024",
        type: "Bazaar",
        date: "17 Mar - 15 Apr 2024",
        time: "10:00 AM - 11:00 PM Daily",
        location: "Wisma Geylang Serai",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
        description: "Immerse yourself in the festive spirit at the Geylang Serai Ramadan Bazaar 2024!",
        isFree: true
    }
];

export const BLOG_POSTS = [
    {
        id: 'b1',
        title: 'Top 10 Halal Cafes to Visit in Bugis for Brunch',
        category: 'Dining Spotlight',
        date: 'May 15, 2024',
        author: 'Sarah Ahmad',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Bugis is a treasure trove of Halal dining. From hidden gems to popular favorites, we explore the best brunch spots.'
    },
    {
        id: 'b2',
        title: 'A Weekend Guide to Geylang Serai Market',
        category: 'Lifestyle',
        date: 'May 13, 2024',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Experience the rich heritage and bustling atmosphere of one of Singapore\'s oldest Malay settlements.'
    },
    {
        id: 'b3',
        title: 'Understanding Halal Certification for SMEs',
        category: 'Business',
        date: 'May 10, 2024',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
        excerpt: 'A comprehensive guide to how MUIS certification works for small businesses and why it matters.'
    }
];

export const FAQ_ITEMS = [
    {
        question: "How do I list my Halal business on the directory?",
        answer: "Listing your business is simple! First, create an account by clicking the 'Sign Up' button in the top right corner. Once logged in, navigate to your dashboard and select 'Add New Listing'. You will need to provide: Valid MUIS Halal Certification or Muslim-Owned establishment proof, Business ACRA registration number, and High-quality photos."
    },
    {
        question: "What are the verification requirements?",
        answer: "Businesses must provide valid documentation issued by recognized authorities. For food establishments, a valid MUIS Halal Certificate is required. For Muslim-owned businesses, ownership verification is necessary."
    },
    {
        question: "How do I update my operating hours?",
        answer: "Log in to your Business Dashboard, select 'Manage Listing', and update the 'Hours' section. Changes are typically reflected within 24 hours."
    }
];
