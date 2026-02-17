/**
 * Database Service – Supabase implementation.
 * API signatures are identical to the previous localStorage version.
 */

import { supabase } from '../src/lib/supabase';
import type { Tables } from '../src/lib/database.types';
import {
    Business, Event, UserReview, User, BlogPost, Notification,
    Category, Region, ListResult,
    AppCategory, AppLocation, Lead, BusinessClaim, HalalCertification,
} from '../types';

// ── DB row type aliases ──────────────────────────────────────────────────────

type DbBusiness    = Tables<'businesses'>;
type DbEvent       = Tables<'events'>;
type DbReview      = Tables<'reviews'>;
type DbProfile     = Tables<'profiles'>;
type DbBlogPost    = Tables<'blog_posts'>;
type DbNotification = Tables<'notifications'>;

// ── Row → App type mappers ───────────────────────────────────────────────────

function mapBusiness(row: DbBusiness): Business {
    return {
        id:                 row.id,
        name:               row.name,
        category:           row.category as Category,
        address:            row.address,
        region:             row.region as Region,
        rating:             Number(row.rating),
        reviewCount:        row.review_count,
        imageUrl:           row.image_url,
        description:        row.description    ?? undefined,
        openingHours:       row.opening_hours  ?? undefined,
        phone:              row.phone          ?? undefined,
        website:            row.website        ?? undefined,
        email:              row.email          ?? undefined,
        isVerified:         row.is_verified,
        isFeatured:         row.is_featured,
        status:             row.status         as Business['status'],
        submissionDate:     row.created_at,
        ownerId:            row.owner_id       ?? undefined,
        lat:                row.lat            ?? undefined,
        lng:                row.lng            ?? undefined,
        tags:               row.tags,
        priceRange:         (row.price_range   ?? undefined) as Business['priceRange'],
        slug:               row.slug           ?? undefined,
        shortDescription:   row.short_description ?? undefined,
        whatsapp:           row.whatsapp       ?? undefined,
        isClaimed:          row.is_claimed     ?? false,
        halalCertification: (row.halal_certification ?? 'self_declared') as HalalCertification,
        muisCertNumber:     row.muis_cert_number ?? undefined,
        muisCertExpiry:     row.muis_cert_expiry ?? undefined,
        listingTier:        (row.listing_tier  ?? 'free') as Business['listingTier'],
        viewCount:          row.view_count     ?? 0,
    };
}

function mapEvent(row: DbEvent): Event {
    return {
        id:          row.id,
        title:       row.title,
        type:        row.type,
        date:        row.date,
        time:        row.time,
        location:    row.location,
        imageUrl:    row.image_url,
        description: row.description,
        isFree:      row.is_free,
        price:       row.price       ?? undefined,
        organizer:   row.organizer   ?? undefined,
        ownerId:     row.owner_id    ?? undefined,
        status:      row.status      as Event['status'],
        lat:         row.lat         ?? undefined,
        lng:         row.lng         ?? undefined,
    };
}

function mapReview(row: DbReview, businessName = ''): UserReview {
    return {
        id:           row.id,
        businessId:   row.business_id,
        businessName,
        userId:       row.user_id    ?? undefined,
        userName:     row.user_name,
        userAvatar:   row.user_avatar ?? undefined,
        rating:       row.rating,
        comment:      row.comment,
        title:        row.title      ?? undefined,
        date:         row.created_at,
        vibeTags:     row.vibe_tags,
        helpful:      row.helpful,
    };
}

async function mapProfile(row: DbProfile): Promise<User> {
    const { data: bookmarkRows } = await supabase
        .from('bookmarks')
        .select('business_id')
        .eq('user_id', row.id);

    return {
        id:                  row.id,
        email:               row.email,
        name:                row.name,
        avatar:              row.avatar              ?? undefined,
        role:                row.role,
        phone:               row.phone               ?? undefined,
        createdAt:           row.created_at,
        bookmarks:           bookmarkRows?.map(b => b.business_id) ?? [],
        subscription:        row.subscription,
        subscriptionStatus:  row.subscription_status ?? undefined,
        subscriptionExpiry:  row.subscription_expiry ?? undefined,
    };
}

function mapBlogPost(row: DbBlogPost): BlogPost {
    return {
        id:       row.id,
        title:    row.title,
        category: row.category,
        date:     row.published_at,
        author:   row.author,
        image:    row.image,
        excerpt:  row.excerpt,
        content:  row.content ?? undefined,
        tags:     row.tags,
    };
}

function mapNotification(row: DbNotification): Notification {
    return {
        id:        row.id,
        userId:    row.user_id,
        title:     row.title,
        message:   row.message,
        type:      row.type,
        read:      row.read,
        createdAt: row.created_at,
        link:      row.link ?? undefined,
    };
}

// ── No-op: Supabase handles persistence ─────────────────────────────────────

export function initializeDatabase() { /* no-op for Supabase */ }

// ── Businesses ───────────────────────────────────────────────────────────────

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
        const page  = filters?.page  ?? 1;
        const limit = filters?.limit ?? 12;
        const from  = (page - 1) * limit;

        let query = supabase
            .from('businesses')
            .select('*', { count: 'exact' });

        // Status / visibility filtering
        if (filters?.status) {
            query = query.eq('status', filters.status);
        } else if (!filters?.ownerId) {
            query = query.eq('status', 'Approved');
        }

        if (filters?.ownerId)  query = query.eq('owner_id', filters.ownerId);
        if (filters?.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
        }
        if (filters?.region && filters.region !== 'All') {
            query = query.eq('region', filters.region);
        }
        if (filters?.featured) query = query.eq('is_featured', true);

        if (filters?.search) {
            const q = filters.search;
            query = query.or(
                `name.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%`
            );
        }

        // Sorting
        switch (filters?.sort) {
            case 'rating':  query = query.order('rating',       { ascending: false }); break;
            case 'newest':  query = query.order('created_at',   { ascending: false }); break;
            case 'reviews': query = query.order('review_count', { ascending: false }); break;
            case 'name':    query = query.order('name',         { ascending: true  }); break;
            default:
                query = query
                    .order('is_featured', { ascending: false })
                    .order('rating',      { ascending: false });
        }

        const { data, count, error } = await query.range(from, from + limit - 1);
        if (error) throw error;

        const total = count ?? 0;
        return {
            data:       (data ?? []).map(mapBusiness),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    getById: async (id: string): Promise<Business | null> => {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return mapBusiness(data);
    },

    getBySlug: async (slug: string): Promise<Business | null> => {
        // Try slug first, fall back to id for backward-compat with UUID links
        const { data: bySlug } = await supabase
            .from('businesses')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
        if (bySlug) return mapBusiness(bySlug);

        // Fallback: treat slug as UUID id
        const { data: byId } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
        if (byId) return mapBusiness(byId);
        return null;
    },

    incrementViewCount: async (id: string): Promise<void> => {
        await supabase.rpc('increment_view_count' as any, { business_id: id }).throwOnError();
    },

    create: async (data: Omit<Business, 'id'>): Promise<Business> => {
        const { data: row, error } = await supabase
            .from('businesses')
            .insert({
                name:          data.name,
                category:      data.category,
                address:       data.address,
                region:        data.region,
                image_url:     data.imageUrl,
                description:   data.description,
                opening_hours: data.openingHours,
                phone:         data.phone,
                website:       data.website,
                email:         data.email,
                is_verified:   data.isVerified,
                is_featured:   data.isFeatured,
                status:        data.status ?? 'Pending Review',
                owner_id:      data.ownerId,
                lat:           data.lat,
                lng:           data.lng,
                tags:          data.tags ?? [],
                price_range:   data.priceRange,
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create business');
        return mapBusiness(row);
    },

    update: async (id: string, data: Partial<Business>): Promise<Business | null> => {
        const updates: Record<string, unknown> = {};
        if (data.name          !== undefined) updates.name          = data.name;
        if (data.category      !== undefined) updates.category      = data.category;
        if (data.address       !== undefined) updates.address       = data.address;
        if (data.region        !== undefined) updates.region        = data.region;
        if (data.imageUrl      !== undefined) updates.image_url     = data.imageUrl;
        if (data.description   !== undefined) updates.description   = data.description;
        if (data.openingHours  !== undefined) updates.opening_hours = data.openingHours;
        if (data.phone         !== undefined) updates.phone         = data.phone;
        if (data.website       !== undefined) updates.website       = data.website;
        if (data.email         !== undefined) updates.email         = data.email;
        if (data.isVerified    !== undefined) updates.is_verified   = data.isVerified;
        if (data.isFeatured    !== undefined) updates.is_featured   = data.isFeatured;
        if (data.status        !== undefined) updates.status        = data.status;
        if (data.ownerId       !== undefined) updates.owner_id      = data.ownerId;
        if (data.lat           !== undefined) updates.lat           = data.lat;
        if (data.lng           !== undefined) updates.lng           = data.lng;
        if (data.tags          !== undefined) updates.tags          = data.tags;
        if (data.priceRange    !== undefined) updates.price_range   = data.priceRange;

        const { data: row, error } = await supabase
            .from('businesses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error || !row) return null;
        return mapBusiness(row);
    },

    delete: async (id: string): Promise<boolean> => {
        const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id);
        return !error;
    },

    getStats: async () => {
        const { data } = await supabase
            .from('businesses')
            .select('status, is_featured');
        const rows = data ?? [];
        return {
            total:    rows.filter(b => b.status === 'Approved').length,
            pending:  rows.filter(b => b.status === 'Pending Review').length,
            rejected: rows.filter(b => b.status === 'Rejected').length,
            featured: rows.filter(b => b.is_featured).length,
        };
    },
};

// ── Events ───────────────────────────────────────────────────────────────────

export const events = {
    list: async (filters?: {
        type?: string;
        search?: string;
        page?: number;
        limit?: number;
        ownerId?: string;
    }): Promise<ListResult<Event>> => {
        const page  = filters?.page  ?? 1;
        const limit = filters?.limit ?? 12;
        const from  = (page - 1) * limit;

        let query = supabase
            .from('events')
            .select('*', { count: 'exact' });

        if (filters?.ownerId) {
            query = query.eq('owner_id', filters.ownerId);
        } else {
            query = query.eq('status', 'Approved');
        }

        if (filters?.type && filters.type !== 'All') {
            query = query.eq('type', filters.type);
        }

        if (filters?.search) {
            const q = filters.search;
            query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
        }

        query = query.order('created_at', { ascending: false });

        const { data, count, error } = await query.range(from, from + limit - 1);
        if (error) throw error;

        const total = count ?? 0;
        return {
            data:       (data ?? []).map(mapEvent),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    getById: async (id: string): Promise<Event | null> => {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return mapEvent(data);
    },

    create: async (data: Omit<Event, 'id'>): Promise<Event> => {
        const { data: row, error } = await supabase
            .from('events')
            .insert({
                title:       data.title,
                type:        data.type,
                date:        data.date,
                time:        data.time,
                location:    data.location,
                image_url:   data.imageUrl,
                description: data.description,
                is_free:     data.isFree ?? true,
                price:       data.price,
                organizer:   data.organizer,
                owner_id:    data.ownerId,
                status:      data.status ?? 'Pending Review',
                lat:         data.lat,
                lng:         data.lng,
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create event');
        return mapEvent(row);
    },

    update: async (id: string, data: Partial<Event>): Promise<Event | null> => {
        const updates: Record<string, unknown> = {};
        if (data.title       !== undefined) updates.title       = data.title;
        if (data.type        !== undefined) updates.type        = data.type;
        if (data.date        !== undefined) updates.date        = data.date;
        if (data.time        !== undefined) updates.time        = data.time;
        if (data.location    !== undefined) updates.location    = data.location;
        if (data.imageUrl    !== undefined) updates.image_url   = data.imageUrl;
        if (data.description !== undefined) updates.description = data.description;
        if (data.isFree      !== undefined) updates.is_free     = data.isFree;
        if (data.price       !== undefined) updates.price       = data.price;
        if (data.organizer   !== undefined) updates.organizer   = data.organizer;
        if (data.status      !== undefined) updates.status      = data.status;
        if (data.lat         !== undefined) updates.lat         = data.lat;
        if (data.lng         !== undefined) updates.lng         = data.lng;

        const { data: row, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error || !row) return null;
        return mapEvent(row);
    },

    delete: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        return !error;
    },
};

// ── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = {
    listByBusiness: async (businessId: string): Promise<UserReview[]> => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(r => mapReview(r));
    },

    listByUser: async (userId: string): Promise<UserReview[]> => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, businesses(name)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(r => {
            const biz = r.businesses as { name: string } | null;
            return mapReview(r, biz?.name ?? '');
        });
    },

    listAll: async (): Promise<UserReview[]> => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, businesses(name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(r => {
            const biz = r.businesses as { name: string } | null;
            return mapReview(r, biz?.name ?? '');
        });
    },

    create: async (data: Omit<UserReview, 'id'>): Promise<UserReview> => {
        const { data: row, error } = await supabase
            .from('reviews')
            .insert({
                business_id:  data.businessId,
                user_id:      data.userId,
                user_name:    data.userName,
                user_avatar:  data.userAvatar,
                rating:       data.rating,
                comment:      data.comment,
                title:        data.title,
                vibe_tags:    data.vibeTags ?? [],
                helpful:      data.helpful ?? 0,
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create review');
        // DB trigger auto-updates businesses.rating and review_count
        return mapReview(row, data.businessName);
    },

    update: async (id: string, data: Partial<UserReview>): Promise<UserReview | null> => {
        const updates: Record<string, unknown> = {};
        if (data.rating    !== undefined) updates.rating     = data.rating;
        if (data.comment   !== undefined) updates.comment    = data.comment;
        if (data.title     !== undefined) updates.title      = data.title;
        if (data.vibeTags  !== undefined) updates.vibe_tags  = data.vibeTags;
        if (data.helpful   !== undefined) updates.helpful    = data.helpful;

        const { data: row, error } = await supabase
            .from('reviews')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error || !row) return null;
        return mapReview(row);
    },

    delete: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        // DB trigger auto-updates businesses.rating and review_count
        return !error;
    },
};

// ── Users / Profiles ─────────────────────────────────────────────────────────

export const users = {
    getById: async (id: string): Promise<User | null> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return mapProfile(data);
    },

    getByEmail: async (email: string): Promise<User | null> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error || !data) return null;
        return mapProfile(data);
    },

    create: async (data: Omit<User, 'id'>): Promise<User> => {
        // Profiles are auto-created by the auth trigger; this is a direct insert fallback.
        const { data: row, error } = await supabase
            .from('profiles')
            .insert({
                id:                  crypto.randomUUID(),
                email:               data.email,
                name:                data.name,
                avatar:              data.avatar,
                role:                data.role,
                phone:               data.phone,
                subscription:        data.subscription,
                subscription_status: data.subscriptionStatus,
                subscription_expiry: data.subscriptionExpiry,
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create user');
        return mapProfile(row);
    },

    update: async (id: string, data: Partial<User>): Promise<User | null> => {
        const updates: Record<string, unknown> = {};
        if (data.name               !== undefined) updates.name                = data.name;
        if (data.avatar             !== undefined) updates.avatar              = data.avatar;
        if (data.role               !== undefined) updates.role                = data.role;
        if (data.phone              !== undefined) updates.phone               = data.phone;
        if (data.subscription       !== undefined) updates.subscription        = data.subscription;
        if (data.subscriptionStatus !== undefined) updates.subscription_status = data.subscriptionStatus;
        if (data.subscriptionExpiry !== undefined) updates.subscription_expiry = data.subscriptionExpiry;

        const { data: row, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error || !row) return null;
        return mapProfile(row);
    },

    list: async (): Promise<User[]> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return Promise.all((data ?? []).map(mapProfile));
    },

    getStats: async () => {
        const { data } = await supabase.from('profiles').select('role');
        const rows = data ?? [];
        return {
            total:  rows.length,
            admins: rows.filter(u => u.role === 'admin').length,
            owners: rows.filter(u => u.role === 'business_owner').length,
        };
    },

    toggleBookmark: async (userId: string, businessId: string): Promise<boolean> => {
        const { data: existing } = await supabase
            .from('bookmarks')
            .select('user_id')
            .eq('user_id', userId)
            .eq('business_id', businessId)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', userId)
                .eq('business_id', businessId);
            return false; // no longer bookmarked
        } else {
            await supabase
                .from('bookmarks')
                .insert({ user_id: userId, business_id: businessId });
            return true; // now bookmarked
        }
    },
};

// ── Blog ─────────────────────────────────────────────────────────────────────

export const blogs = {
    list: async (filters?: {
        category?: string;
        page?: number;
        limit?: number;
    }): Promise<ListResult<BlogPost>> => {
        const page  = filters?.page  ?? 1;
        const limit = filters?.limit ?? 6;
        const from  = (page - 1) * limit;

        let query = supabase
            .from('blog_posts')
            .select('*', { count: 'exact' })
            .order('published_at', { ascending: false });

        if (filters?.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
        }

        const { data, count, error } = await query.range(from, from + limit - 1);
        if (error) throw error;

        const total = count ?? 0;
        return {
            data:       (data ?? []).map(mapBlogPost),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    getById: async (id: string): Promise<BlogPost | null> => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return mapBlogPost(data);
    },
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = {
    listByUser: async (userId: string): Promise<Notification[]> => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(mapNotification);
    },

    create: async (data: Omit<Notification, 'id'>): Promise<Notification> => {
        const { data: row, error } = await supabase
            .from('notifications')
            .insert({
                user_id:    data.userId,
                title:      data.title,
                message:    data.message,
                type:       data.type,
                read:       data.read ?? false,
                link:       data.link,
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create notification');
        return mapNotification(row);
    },

    markRead: async (id: string): Promise<void> => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);
    },

    markAllRead: async (userId: string): Promise<void> => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);
    },

    unreadCount: async (userId: string): Promise<number> => {
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);
        return count ?? 0;
    },
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categories = {
    list: async (): Promise<AppCategory[]> => {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug, icon, display_order, is_active')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        if (error) throw error;
        return (data ?? []).map(row => ({
            id:           row.id,
            name:         row.name,
            slug:         row.slug,
            icon:         row.icon ?? undefined,
            displayOrder: row.display_order,
            isActive:     row.is_active,
        }));
    },
};

// ── Locations ─────────────────────────────────────────────────────────────────

export const locations = {
    list: async (): Promise<AppLocation[]> => {
        const { data, error } = await supabase
            .from('locations')
            .select('id, name, slug, type, region, lat, lng')
            .order('name', { ascending: true });
        if (error) throw error;
        return (data ?? []).map(row => ({
            id:     row.id,
            name:   row.name,
            slug:   row.slug,
            type:   row.type as AppLocation['type'],
            region: row.region ?? undefined,
            lat:    row.lat    ?? undefined,
            lng:    row.lng    ?? undefined,
        }));
    },
};

// ── Leads ─────────────────────────────────────────────────────────────────────

export const leads = {
    create: async (data: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
        const { data: row, error } = await supabase
            .from('leads')
            .insert({
                business_id: data.businessId,
                name:        data.name,
                email:       data.email,
                phone:       data.phone,
                type:        data.type,
                message:     data.message,
                status:      data.status ?? 'new',
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create lead');
        return {
            id:         row.id,
            businessId: row.business_id,
            name:       row.name,
            email:      row.email,
            phone:      row.phone ?? undefined,
            type:       row.type,
            message:    row.message,
            status:     row.status,
            createdAt:  row.created_at,
        };
    },

    listByBusiness: async (businessId: string): Promise<Lead[]> => {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(row => ({
            id:         row.id,
            businessId: row.business_id,
            name:       row.name,
            email:      row.email,
            phone:      row.phone ?? undefined,
            type:       row.type,
            message:    row.message,
            status:     row.status,
            createdAt:  row.created_at,
        }));
    },
};

// ── Business Claims ───────────────────────────────────────────────────────────

export const businessClaims = {
    create: async (data: Omit<BusinessClaim, 'id' | 'createdAt'>): Promise<BusinessClaim> => {
        const { data: row, error } = await supabase
            .from('business_claims')
            .insert({
                business_id: data.businessId,
                user_id:     data.userId,
                proof_url:   data.proofUrl,
                message:     data.message,
                status:      data.status ?? 'pending',
            })
            .select()
            .single();
        if (error || !row) throw error ?? new Error('Failed to create business claim');
        return {
            id:         row.id,
            businessId: row.business_id,
            userId:     row.user_id,
            proofUrl:   row.proof_url   ?? undefined,
            message:    row.message,
            status:     row.status,
            createdAt:  row.created_at,
        };
    },

    list: async (): Promise<BusinessClaim[]> => {
        const { data, error } = await supabase
            .from('business_claims')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []).map(row => ({
            id:         row.id,
            businessId: row.business_id,
            userId:     row.user_id,
            proofUrl:   row.proof_url   ?? undefined,
            message:    row.message,
            status:     row.status,
            createdAt:  row.created_at,
        }));
    },

    updateStatus: async (id: string, status: BusinessClaim['status']): Promise<void> => {
        const { error } = await supabase
            .from('business_claims')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    },
};
