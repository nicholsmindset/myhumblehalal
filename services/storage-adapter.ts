/**
 * StorageAdapter — abstract interface for data persistence.
 *
 * Both the current localStorage implementation and the future Supabase
 * implementation should satisfy this interface.  Switching backends is
 * then a matter of swapping the concrete adapter — no changes needed in
 * pages or components.
 *
 * Usage:
 *   import { adapter } from './storage-adapter';
 *   const biz = await adapter.businesses.getById('biz_1');
 */

import { Business, Event, UserReview, User, BlogPost, Notification, ListResult } from '../types';

// ── Generic CRUD ──

export interface ReadOnlyAdapter<T> {
    getById(id: string): Promise<T | null>;
}

export interface CrudAdapter<T> extends ReadOnlyAdapter<T> {
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

// ── Entity-specific interfaces ──

export interface BusinessAdapter extends CrudAdapter<Business> {
    list(filters?: {
        category?: string;
        region?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: 'rating' | 'newest' | 'reviews' | 'name';
        featured?: boolean;
        status?: string;
        ownerId?: string;
    }): Promise<ListResult<Business>>;
    getStats(): Promise<{
        total: number;
        pending: number;
        rejected: number;
        featured: number;
    }>;
}

export interface EventAdapter extends CrudAdapter<Event> {
    list(filters?: {
        type?: string;
        search?: string;
        page?: number;
        limit?: number;
        ownerId?: string;
    }): Promise<ListResult<Event>>;
}

export interface ReviewAdapter {
    listByBusiness(businessId: string): Promise<UserReview[]>;
    listByUser(userId: string): Promise<UserReview[]>;
    listAll(): Promise<UserReview[]>;
    create(data: Omit<UserReview, 'id'>): Promise<UserReview>;
    update(id: string, data: Partial<UserReview>): Promise<UserReview | null>;
    delete(id: string): Promise<boolean>;
}

export interface UserAdapter {
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    create(data: Omit<User, 'id'>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    updateRole(userId: string, newRole: User['role']): Promise<User | null>;
    list(): Promise<User[]>;
    getStats(): Promise<{ total: number; admins: number; owners: number }>;
    toggleBookmark(userId: string, businessId: string): Promise<boolean>;
}

export interface BlogAdapter {
    list(filters?: { category?: string; page?: number; limit?: number }): Promise<ListResult<BlogPost>>;
    getById(id: string): Promise<BlogPost | null>;
}

export interface NotificationAdapter {
    listByUser(userId: string): Promise<Notification[]>;
    create(data: Omit<Notification, 'id'>): Promise<Notification>;
    markRead(id: string): Promise<void>;
    markAllRead(userId: string): Promise<void>;
    unreadCount(userId: string): Promise<number>;
}

// ── Composite adapter ──

export interface StorageAdapter {
    businesses: BusinessAdapter;
    events: EventAdapter;
    reviews: ReviewAdapter;
    users: UserAdapter;
    blogs: BlogAdapter;
    notifications: NotificationAdapter;
    initialize(): void;
}

// ── Current localStorage adapter (re-exports from db.ts) ──

import * as db from './db';

export const localStorageAdapter: StorageAdapter = {
    businesses: db.businesses,
    events: db.events,
    reviews: db.reviews,
    users: db.users,
    blogs: db.blogs,
    notifications: db.notifications,
    initialize: db.initializeDatabase,
};

// Default export — swap this to supabaseAdapter after migration
export const adapter: StorageAdapter = localStorageAdapter;
