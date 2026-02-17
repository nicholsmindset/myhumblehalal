
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
    isVerified?: boolean;
    isFeatured?: boolean;
    status?: SubmissionStatus;
    submissionDate?: string;
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
}

export interface UserReview {
    id: string;
    businessId: string;
    businessName: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    vibeTags?: string[];
}
