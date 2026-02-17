import { describe, it, expect, beforeEach } from 'vitest';
import { auth } from '../auth';
import { initializeDatabase } from '../db';

// Seed data so demo users/passwords exist
beforeEach(() => {
    localStorage.clear();
    initializeDatabase();
});

describe('auth', () => {
    describe('login', () => {
        it('succeeds with correct demo credentials', async () => {
            const result = await auth.login('admin@halalbiz.sg', 'admin123');
            expect(result.error).toBeNull();
            expect(result.user).not.toBeNull();
            expect(result.user?.email).toBe('admin@halalbiz.sg');
        });

        it('returns generic error for non-existent email', async () => {
            const result = await auth.login('nobody@example.com', 'whatever');
            expect(result.error).toBe('Invalid email or password.');
            expect(result.user).toBeNull();
        });

        it('returns generic error for wrong password', async () => {
            const result = await auth.login('admin@halalbiz.sg', 'wrongpassword');
            expect(result.error).toBe('Invalid email or password.');
            expect(result.user).toBeNull();
        });

        it('is case-insensitive for email', async () => {
            const result = await auth.login('Admin@HalalBiz.SG', 'admin123');
            expect(result.error).toBeNull();
            expect(result.user?.email).toBe('admin@halalbiz.sg');
        });

        it('migrates plaintext password to hash on successful login', async () => {
            // First login with plaintext
            await auth.login('admin@halalbiz.sg', 'admin123');
            const passwords = JSON.parse(localStorage.getItem('hb_passwords') || '{}');
            expect(passwords['admin@halalbiz.sg']).toMatch(/^sha256\$/);
        });

        it('rate limits after too many failed attempts', async () => {
            // Use a different account to avoid poisoning admin@ for later tests
            for (let i = 0; i < 5; i++) {
                await auth.login('ahmad@example.com', 'wrong');
            }
            const result = await auth.login('ahmad@example.com', 'password123');
            expect(result.error).toContain('Too many login attempts');
        });
    });

    describe('register', () => {
        it('creates a new user with valid data', async () => {
            const result = await auth.register('new@example.com', 'SecurePass1!', 'Test User');
            expect(result.error).toBeNull();
            expect(result.user).not.toBeNull();
            expect(result.user?.email).toBe('new@example.com');
            expect(result.user?.role).toBe('user');
        });

        it('rejects weak passwords', async () => {
            const result = await auth.register('new@example.com', 'weak', 'Test User');
            expect(result.error).not.toBeNull();
            expect(result.user).toBeNull();
        });

        it('rejects duplicate email', async () => {
            const result = await auth.register('admin@halalbiz.sg', 'SecurePass1!', 'Duplicate');
            expect(result.error).toContain('already exists');
        });

        it('rejects invalid email', async () => {
            const result = await auth.register('not-an-email', 'SecurePass1!', 'Test');
            expect(result.error).toContain('valid email');
        });

        it('rejects empty name', async () => {
            const result = await auth.register('new@example.com', 'SecurePass1!', '');
            expect(result.error).toContain('Name is required');
        });

        it('stores hashed password for new accounts', async () => {
            await auth.register('new@example.com', 'SecurePass1!', 'Test');
            const passwords = JSON.parse(localStorage.getItem('hb_passwords') || '{}');
            expect(passwords['new@example.com']).toMatch(/^sha256\$/);
        });

        it('auto-logs in after registration', async () => {
            await auth.register('new@example.com', 'SecurePass1!', 'Test');
            const user = auth.getCurrentUser();
            expect(user?.email).toBe('new@example.com');
        });
    });

    describe('getCurrentUser', () => {
        it('returns null when not logged in', () => {
            expect(auth.getCurrentUser()).toBeNull();
        });

        it('returns user after login', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            const user = auth.getCurrentUser();
            expect(user?.email).toBe('admin@halalbiz.sg');
        });

        it('returns null after logout', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            await auth.logout();
            expect(auth.getCurrentUser()).toBeNull();
        });
    });

    describe('session expiration', () => {
        it('stores session with expiresAt', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            const raw = localStorage.getItem('hb_auth_session');
            const session = JSON.parse(raw || '{}');
            expect(session.expiresAt).toBeDefined();
            expect(session.user).toBeDefined();
        });
    });

    describe('updatePassword', () => {
        it('changes password successfully', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            const result = await auth.updatePassword('admin@halalbiz.sg', 'admin123', 'NewSecure1!');
            expect(result.error).toBeNull();

            // Log out and log in with new password
            await auth.logout();
            const loginResult = await auth.login('admin@halalbiz.sg', 'NewSecure1!');
            expect(loginResult.error).toBeNull();
        });

        it('rejects wrong old password', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            const result = await auth.updatePassword('admin@halalbiz.sg', 'wrongold', 'NewSecure1!');
            expect(result.error).toContain('incorrect');
        });

        it('validates new password strength', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            const result = await auth.updatePassword('admin@halalbiz.sg', 'admin123', 'weak');
            expect(result.error).not.toBeNull();
        });
    });

    describe('onAuthStateChange', () => {
        it('notifies listeners on login', async () => {
            let notified = false;
            const unsub = auth.onAuthStateChange(() => { notified = true; });
            await auth.login('admin@halalbiz.sg', 'admin123');
            expect(notified).toBe(true);
            unsub();
        });

        it('notifies listeners on logout', async () => {
            await auth.login('admin@halalbiz.sg', 'admin123');
            let loggedOut = false;
            const unsub = auth.onAuthStateChange((user) => { if (!user) loggedOut = true; });
            await auth.logout();
            expect(loggedOut).toBe(true);
            unsub();
        });

        it('unsubscribes correctly', async () => {
            let count = 0;
            const unsub = auth.onAuthStateChange(() => { count++; });
            await auth.login('admin@halalbiz.sg', 'admin123');
            unsub();
            await auth.logout();
            expect(count).toBe(1); // only the login notification
        });
    });

    describe('requestPasswordReset', () => {
        it('returns demo mode error', async () => {
            const result = await auth.requestPasswordReset('admin@halalbiz.sg');
            expect(result.error).toContain('demo mode');
        });
    });
});
