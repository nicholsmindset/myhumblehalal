/**
 * Database Service - localStorage-backed, Supabase-ready interface.
 *
 * To migrate to Supabase, replace each method's implementation with:
 *   const { data, error } = await supabase.from('table').select('*')...
 * The API signatures stay the same.
 */

import { Business, Event, UserReview, User, BlogPost, Notification, Category, Region, ListResult } from '../types';
import { SEED_BUSINESSES, SEED_EVENTS, SEED_REVIEWS, SEED_BLOG_POSTS, SEED_USERS } from './seed-data';

// --------------- localStorage helpers ---------------

const KEYS = {
    businesses: 'hb_businesses',
    events: 'hb_events',
    reviews: 'hb_reviews',
    users: 'hb_users',
    blogs: 'hb_blogs',
    notifications: 'hb_notifications',
    initialized: 'hb_initialized',
};

function store<T>(key: string): {
    getAll: () => T[];
    set: (data: T[]) => void;
} {
    return {
        getAll: () => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        },
        set: (data: T[]) => {
            localStorage.setItem(key, JSON.stringify(data));
        },
    };
}

// --------------- Initialize seed data on first visit ---------------

export function initializeDatabase() {
    if (localStorage.getItem(KEYS.initialized)) return;
    store<Business>(KEYS.businesses).set(SEED_BUSINESSES);
    store<Event>(KEYS.events).set(SEED_EVENTS);
    store<UserReview>(KEYS.reviews).set(SEED_REVIEWS);
    store<User>(KEYS.users).set(SEED_USERS);
    store<BlogPost>(KEYS.blogs).set(SEED_BLOG_POSTS);
    store<Notification>(KEYS.notifications).set([]);
    localStorage.setItem(KEYS.initialized, 'true');
}

// --------------- ID generation ---------------

function genId(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// --------------- Businesses ---------------

export const businesses = {
    list: async (filters?: {
        category?: string;
        region?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: 'rating' | 'newest' | 'reviews' | 'name';
        featured?: boolean;
        status?: string;
        ownerId?: string;
    }): Promise<ListResult<Business>> => {
        let items = store<Business>(KEYS.businesses).getAll();
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 12;

        // Filter by status (default to Approved for public views)
        if (filters?.status) {
            items = items.filter(b => b.status === filters.status);
        } else if (!filters?.ownerId) {
            items = items.filter(b => b.status === 'Approved');
        }

        if (filters?.ownerId) {
            items = items.filter(b => b.ownerId === filters.ownerId);
        }
        if (filters?.category && filters.category !== 'All') {
            items = items.filter(b => b.category === filters.category);
        }
        if (filters?.region && filters.region !== 'All') {
            items = items.filter(b => b.region === filters.region);
        }
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            items = items.filter(b =>
                b.name.toLowerCase().includes(q) ||
                b.description?.toLowerCase().includes(q) ||
                b.address.toLowerCase().includes(q) ||
                b.tags?.some(t => t.toLowerCase().includes(q))
            );
        }
        if (filters?.featured) {
            items = items.filter(b => b.isFeatured);
        }

        // Sort
        switch (filters?.sort) {
            case 'rating': items.sort((a, b) => b.rating - a.rating); break;
            case 'newest': items.sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || '')); break;
            case 'reviews': items.sort((a, b) => b.reviewCount - a.reviewCount); break;
            case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
        }

        const total = items.length;
        const start = (page - 1) * limit;
        const data = items.slice(start, start + limit);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    getById: async (id: string): Promise<Business | null> => {
        const items = store<Business>(KEYS.businesses).getAll();
        return items.find(b => b.id === id) || null;
    },

    create: async (data: Omit<Business, 'id'>): Promise<Business> => {
        const items = store<Business>(KEYS.businesses).getAll();
        const business: Business = { id: genId('biz'), ...data };
        items.push(business);
        store<Business>(KEYS.businesses).set(items);
        return business;
    },

    update: async (id: string, data: Partial<Business>): Promise<Business | null> => {
        const items = store<Business>(KEYS.businesses).getAll();
        const idx = items.findIndex(b => b.id === id);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...data };
        store<Business>(KEYS.businesses).set(items);
        return items[idx];
    },

    delete: async (id: string): Promise<boolean> => {
        const items = store<Business>(KEYS.businesses).getAll();
        const filtered = items.filter(b => b.id !== id);
        store<Business>(KEYS.businesses).set(filtered);
        return filtered.length < items.length;
    },

    getStats: async () => {
        const items = store<Business>(KEYS.businesses).getAll();
        return {
            total: items.filter(b => b.status === 'Approved').length,
            pending: items.filter(b => b.status === 'Pending Review').length,
            rejected: items.filter(b => b.status === 'Rejected').length,
            featured: items.filter(b => b.isFeatured).length,
        };
    },
};

// --------------- Events ---------------

export const events = {
    list: async (filters?: {
        type?: string;
        search?: string;
        page?: number;
        limit?: number;
        ownerId?: string;
    }): Promise<ListResult<Event>> => {
        let items = store<Event>(KEYS.events).getAll();
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 12;

        if (filters?.ownerId) {
            items = items.filter(e => e.ownerId === filters.ownerId);
        }
        if (filters?.type && filters.type !== 'All') {
            items = items.filter(e => e.type === filters.type);
        }
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            items = items.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.location.toLowerCase().includes(q)
            );
        }

        const total = items.length;
        const start = (page - 1) * limit;
        const data = items.slice(start, start + limit);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    getById: async (id: string): Promise<Event | null> => {
        return store<Event>(KEYS.events).getAll().find(e => e.id === id) || null;
    },

    create: async (data: Omit<Event, 'id'>): Promise<Event> => {
        const items = store<Event>(KEYS.events).getAll();
        const event: Event = { id: genId('evt'), ...data };
        items.push(event);
        store<Event>(KEYS.events).set(items);
        return event;
    },

    update: async (id: string, data: Partial<Event>): Promise<Event | null> => {
        const items = store<Event>(KEYS.events).getAll();
        const idx = items.findIndex(e => e.id === id);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...data };
        store<Event>(KEYS.events).set(items);
        return items[idx];
    },

    delete: async (id: string): Promise<boolean> => {
        const items = store<Event>(KEYS.events).getAll();
        const filtered = items.filter(e => e.id !== id);
        store<Event>(KEYS.events).set(filtered);
        return filtered.length < items.length;
    },
};

// --------------- Reviews ---------------

export const reviews = {
    listByBusiness: async (businessId: string): Promise<UserReview[]> => {
        return store<UserReview>(KEYS.reviews).getAll().filter(r => r.businessId === businessId);
    },

    listByUser: async (userId: string): Promise<UserReview[]> => {
        return store<UserReview>(KEYS.reviews).getAll().filter(r => r.userId === userId);
    },

    listAll: async (): Promise<UserReview[]> => {
        return store<UserReview>(KEYS.reviews).getAll();
    },

    create: async (data: Omit<UserReview, 'id'>): Promise<UserReview> => {
        const allReviews = store<UserReview>(KEYS.reviews).getAll();
        const review: UserReview = { id: genId('rev'), ...data };
        allReviews.push(review);
        store<UserReview>(KEYS.reviews).set(allReviews);

        // Update business rating and review count
        const allBusinesses = store<Business>(KEYS.businesses).getAll();
        const bizIdx = allBusinesses.findIndex(b => b.id === data.businessId);
        if (bizIdx !== -1) {
            const bizReviews = allReviews.filter(r => r.businessId === data.businessId);
            const avgRating = bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length;
            allBusinesses[bizIdx].rating = Math.round(avgRating * 10) / 10;
            allBusinesses[bizIdx].reviewCount = bizReviews.length;
            store<Business>(KEYS.businesses).set(allBusinesses);
        }

        return review;
    },

    update: async (id: string, data: Partial<UserReview>): Promise<UserReview | null> => {
        const items = store<UserReview>(KEYS.reviews).getAll();
        const idx = items.findIndex(r => r.id === id);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...data };
        store<UserReview>(KEYS.reviews).set(items);
        return items[idx];
    },

    delete: async (id: string): Promise<boolean> => {
        const items = store<UserReview>(KEYS.reviews).getAll();
        const review = items.find(r => r.id === id);
        const filtered = items.filter(r => r.id !== id);
        store<UserReview>(KEYS.reviews).set(filtered);

        // Re-calc business rating
        if (review) {
            const allBusinesses = store<Business>(KEYS.businesses).getAll();
            const bizIdx = allBusinesses.findIndex(b => b.id === review.businessId);
            if (bizIdx !== -1) {
                const remaining = filtered.filter(r => r.businessId === review.businessId);
                allBusinesses[bizIdx].reviewCount = remaining.length;
                allBusinesses[bizIdx].rating = remaining.length > 0
                    ? Math.round(remaining.reduce((s, r) => s + r.rating, 0) / remaining.length * 10) / 10
                    : 0;
                store<Business>(KEYS.businesses).set(allBusinesses);
            }
        }

        return filtered.length < items.length;
    },
};

// --------------- Users ---------------

export const users = {
    getById: async (id: string): Promise<User | null> => {
        return store<User>(KEYS.users).getAll().find(u => u.id === id) || null;
    },

    getByEmail: async (email: string): Promise<User | null> => {
        return store<User>(KEYS.users).getAll().find(u => u.email === email) || null;
    },

    create: async (data: Omit<User, 'id'>): Promise<User> => {
        const items = store<User>(KEYS.users).getAll();
        const user: User = { id: genId('usr'), ...data };
        items.push(user);
        store<User>(KEYS.users).set(items);
        return user;
    },

    update: async (id: string, data: Partial<User>): Promise<User | null> => {
        const items = store<User>(KEYS.users).getAll();
        const idx = items.findIndex(u => u.id === id);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...data };
        store<User>(KEYS.users).set(items);
        return items[idx];
    },

    list: async (): Promise<User[]> => {
        return store<User>(KEYS.users).getAll();
    },

    getStats: async () => {
        const items = store<User>(KEYS.users).getAll();
        return {
            total: items.length,
            admins: items.filter(u => u.role === 'admin').length,
            owners: items.filter(u => u.role === 'business_owner').length,
        };
    },

    toggleBookmark: async (userId: string, businessId: string): Promise<boolean> => {
        const items = store<User>(KEYS.users).getAll();
        const idx = items.findIndex(u => u.id === userId);
        if (idx === -1) return false;
        const bookmarks = items[idx].bookmarks || [];
        const isBookmarked = bookmarks.includes(businessId);
        items[idx].bookmarks = isBookmarked
            ? bookmarks.filter(id => id !== businessId)
            : [...bookmarks, businessId];
        store<User>(KEYS.users).set(items);
        return !isBookmarked; // returns new bookmark state
    },
};

// --------------- Blog ---------------

export const blogs = {
    list: async (filters?: { category?: string; page?: number; limit?: number }): Promise<ListResult<BlogPost>> => {
        let items = store<BlogPost>(KEYS.blogs).getAll();
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 6;

        if (filters?.category && filters.category !== 'All') {
            items = items.filter(b => b.category === filters.category);
        }

        const total = items.length;
        const start = (page - 1) * limit;
        const data = items.slice(start, start + limit);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    getById: async (id: string): Promise<BlogPost | null> => {
        return store<BlogPost>(KEYS.blogs).getAll().find(b => b.id === id) || null;
    },
};

// --------------- Notifications ---------------

export const notifications = {
    listByUser: async (userId: string): Promise<Notification[]> => {
        return store<Notification>(KEYS.notifications).getAll()
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    create: async (data: Omit<Notification, 'id'>): Promise<Notification> => {
        const items = store<Notification>(KEYS.notifications).getAll();
        const notif: Notification = { id: genId('ntf'), ...data };
        items.push(notif);
        store<Notification>(KEYS.notifications).set(items);
        return notif;
    },

    markRead: async (id: string): Promise<void> => {
        const items = store<Notification>(KEYS.notifications).getAll();
        const idx = items.findIndex(n => n.id === id);
        if (idx !== -1) {
            items[idx].read = true;
            store<Notification>(KEYS.notifications).set(items);
        }
    },

    markAllRead: async (userId: string): Promise<void> => {
        const items = store<Notification>(KEYS.notifications).getAll();
        items.forEach(n => { if (n.userId === userId) n.read = true; });
        store<Notification>(KEYS.notifications).set(items);
    },

    unreadCount: async (userId: string): Promise<number> => {
        return store<Notification>(KEYS.notifications).getAll()
            .filter(n => n.userId === userId && !n.read).length;
    },
};
