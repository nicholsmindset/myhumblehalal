
export enum Category {
    FOOD = "Food & Beverage",
    RETAIL = "Retail & Shopping",
    HEALTH = "Health & Wellness",
    PROFESSIONAL = "Professional Services",
    EDUCATION = "Education & Enrichment",
    TRAVEL = "Travel & Hospitality",
    BEAUTY = "Beauty & Personal Care",
    HOME = "Home Services"
}

export enum Region {
    CENTRAL = "Central Region",
    EAST = "East Region",
    WEST = "West Region",
    NORTH = "North Region"
}

export type SubmissionStatus = 'Approved' | 'Pending Review' | 'Rejected';
export type UserRole = 'user' | 'business_owner' | 'admin';
export type SubscriptionPlan = 'free' | 'premium' | 'corporate';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    phone?: string;
    createdAt: string;
    bookmarks: string[];
    subscription: SubscriptionPlan;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionExpiry?: string;
}

export interface Business {
    id: string;
    name: string;
    category: Category;
    address: string;
    region: Region;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    description?: string;
    openingHours?: string;
    phone?: string;
    website?: string;
    email?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    status?: SubmissionStatus;
    submissionDate?: string;
    ownerId?: string;
    lat?: number;
    lng?: number;
    tags?: string[];
    priceRange?: '$' | '$$' | '$$$';
}

export interface Event {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
    description: string;
    isFree?: boolean;
    price?: number;
    organizer?: string;
    ownerId?: string;
    status?: SubmissionStatus;
    lat?: number;
    lng?: number;
}

export interface UserReview {
    id: string;
    businessId: string;
    businessName: string;
    userId?: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    title?: string;
    date: string;
    vibeTags?: string[];
    helpful?: number;
}

export interface BlogPost {
    id: string;
    title: string;
    category: string;
    date: string;
    author: string;
    image: string;
    excerpt: string;
    content?: string;
    tags?: string[];
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
    createdAt: string;
    link?: string;
}

export interface ListResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
