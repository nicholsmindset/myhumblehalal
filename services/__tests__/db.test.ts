import { describe, it, expect, beforeEach } from 'vitest';
import { initializeDatabase, businesses, events, reviews, users, blogs, notifications } from '../db';

beforeEach(() => {
    localStorage.clear();
    initializeDatabase();
});

describe('db', () => {
    describe('initializeDatabase', () => {
        it('seeds data on first call', () => {
            expect(localStorage.getItem('hb_initialized')).toBe('true');
            expect(JSON.parse(localStorage.getItem('hb_businesses') || '[]').length).toBeGreaterThan(0);
            expect(JSON.parse(localStorage.getItem('hb_users') || '[]').length).toBeGreaterThan(0);
        });

        it('seeds demo passwords', () => {
            const passwords = JSON.parse(localStorage.getItem('hb_passwords') || '{}');
            expect(passwords['admin@halalbiz.sg']).toBeDefined();
        });

        it('does not re-seed on subsequent calls', () => {
            const before = JSON.parse(localStorage.getItem('hb_businesses') || '[]').length;
            initializeDatabase();
            const after = JSON.parse(localStorage.getItem('hb_businesses') || '[]').length;
            expect(after).toBe(before);
        });
    });

    describe('businesses', () => {
        it('lists approved businesses by default', async () => {
            const result = await businesses.list();
            expect(result.data.length).toBeGreaterThan(0);
            result.data.forEach(b => expect(b.status).toBe('Approved'));
        });

        it('filters by category', async () => {
            const result = await businesses.list({ category: 'Food & Beverage' });
            result.data.forEach(b => expect(b.category).toBe('Food & Beverage'));
        });

        it('supports search', async () => {
            const result = await businesses.list({ search: 'coconut' });
            expect(result.data.some(b => b.name.toLowerCase().includes('coconut'))).toBe(true);
        });

        it('paginates results', async () => {
            const page1 = await businesses.list({ page: 1, limit: 3 });
            const page2 = await businesses.list({ page: 2, limit: 3 });
            expect(page1.data.length).toBeLessThanOrEqual(3);
            expect(page1.page).toBe(1);
            expect(page2.page).toBe(2);
            expect(page1.totalPages).toBeGreaterThanOrEqual(1);
        });

        it('caps limit at MAX_PAGE_LIMIT', async () => {
            const result = await businesses.list({ limit: 9999 });
            expect(result.limit).toBeLessThanOrEqual(100);
        });

        it('sorts by rating', async () => {
            const result = await businesses.list({ sort: 'rating' });
            for (let i = 1; i < result.data.length; i++) {
                expect(result.data[i - 1].rating).toBeGreaterThanOrEqual(result.data[i].rating);
            }
        });

        it('gets by ID', async () => {
            const biz = await businesses.getById('biz_1');
            expect(biz).not.toBeNull();
            expect(biz?.name).toBe('The Coconut Club');
        });

        it('creates with validation', async () => {
            const biz = await businesses.create({
                name: 'New Biz',
                category: 'Food & Beverage' as any,
                address: '123 St',
                region: 'Central Region' as any,
                rating: 0,
                reviewCount: 0,
                imageUrl: 'https://example.com/img.jpg',
                status: 'Pending Review',
            });
            expect(biz.id).toMatch(/^biz_/);
        });

        it('rejects creation with missing required fields', async () => {
            await expect(businesses.create({
                name: '',
                category: '' as any,
                address: '',
                region: '' as any,
                rating: 0,
                reviewCount: 0,
                imageUrl: '',
            })).rejects.toThrow('Validation failed');
        });

        it('updates a business', async () => {
            const updated = await businesses.update('biz_1', { name: 'Updated Name' });
            expect(updated?.name).toBe('Updated Name');
        });

        it('deletes a business', async () => {
            const deleted = await businesses.delete('biz_1');
            expect(deleted).toBe(true);
            const biz = await businesses.getById('biz_1');
            expect(biz).toBeNull();
        });

        it('returns stats', async () => {
            const stats = await businesses.getStats();
            expect(stats.total).toBeGreaterThan(0);
            expect(typeof stats.pending).toBe('number');
        });
    });

    describe('events', () => {
        it('lists events', async () => {
            const result = await events.list();
            expect(result.data.length).toBeGreaterThan(0);
        });

        it('gets event by ID', async () => {
            const evt = await events.getById('evt_1');
            expect(evt).not.toBeNull();
        });

        it('creates an event with validation', async () => {
            const evt = await events.create({
                title: 'Test Event',
                type: 'Workshop',
                date: '2025-06-01',
                time: '2:00 PM',
                location: 'Test Venue',
                imageUrl: 'https://example.com/img.jpg',
                description: 'A test event description',
            });
            expect(evt.id).toMatch(/^evt_/);
        });
    });

    describe('reviews', () => {
        it('lists reviews by business', async () => {
            const revs = await reviews.listByBusiness('biz_1');
            expect(revs.length).toBeGreaterThan(0);
        });

        it('creates a review and updates business rating', async () => {
            const reviewsBefore = await reviews.listByBusiness('biz_1');
            const rev = await reviews.create({
                businessId: 'biz_1',
                businessName: 'The Coconut Club',
                userName: 'Test User',
                rating: 1,
                comment: 'Not great',
                date: '2025-01-01',
            });
            expect(rev.id).toMatch(/^rev_/);

            const bizAfter = await businesses.getById('biz_1');
            // reviewCount recalculated from actual reviews in storage, not seed value
            expect(bizAfter?.reviewCount).toBe(reviewsBefore.length + 1);
        });

        it('deletes a review and recalculates rating', async () => {
            const revsBefore = await reviews.listByBusiness('biz_1');
            const deleted = await reviews.delete(revsBefore[0].id);
            expect(deleted).toBe(true);
            const revsAfter = await reviews.listByBusiness('biz_1');
            expect(revsAfter.length).toBe(revsBefore.length - 1);
        });
    });

    describe('users', () => {
        it('gets user by ID', async () => {
            const user = await users.getById('usr_admin');
            expect(user?.email).toBe('admin@halalbiz.sg');
        });

        it('gets user by email', async () => {
            const user = await users.getByEmail('admin@halalbiz.sg');
            expect(user).not.toBeNull();
        });

        it('creates a user with UUID-based ID', async () => {
            const user = await users.create({
                email: 'test@example.com',
                name: 'Test',
                role: 'user',
                createdAt: new Date().toISOString(),
                bookmarks: [],
                subscription: 'free',
            });
            expect(user.id).toMatch(/^usr_/);
        });

        it('strips role from update() to prevent escalation', async () => {
            const before = await users.getById('usr_demo_user');
            expect(before?.role).toBe('user');

            await users.update('usr_demo_user', { role: 'admin', name: 'Hacked' } as any);
            const after = await users.getById('usr_demo_user');
            expect(after?.role).toBe('user'); // role unchanged
            expect(after?.name).toBe('Hacked'); // other fields updated
        });

        it('allows role changes via updateRole()', async () => {
            await users.updateRole('usr_demo_user', 'business_owner');
            const updated = await users.getById('usr_demo_user');
            expect(updated?.role).toBe('business_owner');
        });

        it('toggles bookmarks', async () => {
            const isBookmarked = await users.toggleBookmark('usr_admin', 'biz_1');
            expect(isBookmarked).toBe(true);
            const isUnbookmarked = await users.toggleBookmark('usr_admin', 'biz_1');
            expect(isUnbookmarked).toBe(false);
        });

        it('returns stats', async () => {
            const stats = await users.getStats();
            expect(stats.total).toBeGreaterThan(0);
            expect(stats.admins).toBeGreaterThan(0);
        });
    });

    describe('blogs', () => {
        it('lists blog posts', async () => {
            const result = await blogs.list();
            expect(result.data.length).toBeGreaterThan(0);
        });

        it('gets blog by ID', async () => {
            const blog = await blogs.getById('blog_1');
            expect(blog).not.toBeNull();
        });
    });

    describe('notifications', () => {
        it('creates and lists notifications', async () => {
            await notifications.create({
                userId: 'usr_admin',
                title: 'Test',
                message: 'Test notification',
                type: 'info',
                read: false,
                createdAt: new Date().toISOString(),
            });
            const list = await notifications.listByUser('usr_admin');
            expect(list.length).toBe(1);
        });

        it('marks notification as read', async () => {
            const notif = await notifications.create({
                userId: 'usr_admin',
                title: 'Test',
                message: 'Message',
                type: 'info',
                read: false,
                createdAt: new Date().toISOString(),
            });
            await notifications.markRead(notif.id);
            const list = await notifications.listByUser('usr_admin');
            expect(list[0].read).toBe(true);
        });

        it('counts unread notifications', async () => {
            await notifications.create({
                userId: 'usr_admin',
                title: 'Unread',
                message: 'Msg',
                type: 'info',
                read: false,
                createdAt: new Date().toISOString(),
            });
            const count = await notifications.unreadCount('usr_admin');
            expect(count).toBe(1);
        });

        it('marks all read', async () => {
            await notifications.create({ userId: 'usr_admin', title: 'A', message: 'M', type: 'info', read: false, createdAt: new Date().toISOString() });
            await notifications.create({ userId: 'usr_admin', title: 'B', message: 'M', type: 'info', read: false, createdAt: new Date().toISOString() });
            await notifications.markAllRead('usr_admin');
            const count = await notifications.unreadCount('usr_admin');
            expect(count).toBe(0);
        });
    });

    describe('ID generation', () => {
        it('generates UUID-based IDs', async () => {
            const biz = await businesses.create({
                name: 'UUID Test',
                category: 'Food & Beverage' as any,
                address: '123 Test',
                region: 'Central Region' as any,
                rating: 0,
                reviewCount: 0,
                imageUrl: 'https://example.com/img.jpg',
            });
            // Format: prefix_uuid (e.g., biz_a1b2c3d4-e5f6-...)
            expect(biz.id).toMatch(/^biz_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });
    });
});
