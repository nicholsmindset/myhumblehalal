/**
 * Auth Service - localStorage-backed, Supabase-ready interface.
 *
 * Security features:
 *  - SHA-256 password hashing with per-password salts
 *  - Session expiration (24 h)
 *  - Login rate limiting (5 attempts / 15 min per email)
 *  - Generic error messages to prevent user enumeration
 *  - Cross-tab session sync via StorageEvent
 *
 * To migrate to Supabase, replace with:
 *   import { createClient } from '@supabase/supabase-js'
 *   const supabase = createClient(url, key)
 *   supabase.auth.signInWithPassword({ email, password })
 */

import { User } from '../types';
import * as db from './db';
import { hashPassword, verifyPassword, isHashedPassword } from './crypto';
import { validatePassword, validateEmail } from './validation';

// ── Constants ──

const AUTH_KEY = 'hb_auth_session';
const PASSWORDS_KEY = 'hb_passwords';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const GENERIC_AUTH_ERROR = 'Invalid email or password.';

// ── Rate limiting (in-memory, resets on page refresh) ──

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
    count: number;
    firstAttempt: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

function isRateLimited(email: string): boolean {
    const record = loginAttempts.get(email);
    if (!record) return false;
    const elapsed = Date.now() - record.firstAttempt;
    if (elapsed > LOCKOUT_DURATION_MS) {
        loginAttempts.delete(email);
        return false;
    }
    return record.count >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(email: string): void {
    const record = loginAttempts.get(email);
    if (!record || Date.now() - record.firstAttempt > LOCKOUT_DURATION_MS) {
        loginAttempts.set(email, { count: 1, firstAttempt: Date.now() });
    } else {
        record.count++;
    }
}

function clearLoginAttempts(email: string): void {
    loginAttempts.delete(email);
}

// ── Session helpers ──

interface AuthSession {
    user: User;
    expiresAt: string;
}

function saveSession(user: User): void {
    const session: AuthSession = {
        user,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

function loadSession(): User | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);

        // New format: { user, expiresAt }
        if (parsed.expiresAt && parsed.user) {
            const session = parsed as AuthSession;
            if (new Date(session.expiresAt).getTime() <= Date.now()) {
                localStorage.removeItem(AUTH_KEY);
                return null;
            }
            return session.user;
        }

        // Legacy format: raw User object — migrate
        if (parsed.id && parsed.email) {
            saveSession(parsed as User);
            return parsed as User;
        }

        localStorage.removeItem(AUTH_KEY);
        return null;
    } catch {
        localStorage.removeItem(AUTH_KEY);
        return null;
    }
}

// ── Password store ──

function getPasswords(): Record<string, string> {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
}

function setPasswords(data: Record<string, string>): void {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(data));
}

// ── Listeners ──

type AuthListener = (user: User | null) => void;
const listeners: AuthListener[] = [];

function notifyListeners(user: User | null): void {
    listeners.forEach(fn => fn(user));
}

// ── Cross-tab session sync ──

if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === AUTH_KEY) {
            const user = loadSession();
            notifyListeners(user);
        }
    });
}

// ── Public API ──

export const auth = {
    /**
     * Sign in with email and password.
     * - Verifies against hashed passwords
     * - Auto-migrates legacy plaintext passwords to hashed
     * - Rate-limited to prevent brute force
     */
    login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
        const normalizedEmail = email.toLowerCase().trim();

        if (isRateLimited(normalizedEmail)) {
            return { user: null, error: 'Too many login attempts. Please try again in 15 minutes.' };
        }

        const passwords = getPasswords();
        const storedPassword = passwords[normalizedEmail];

        if (!storedPassword) {
            recordLoginAttempt(normalizedEmail);
            return { user: null, error: GENERIC_AUTH_ERROR };
        }

        const isValid = await verifyPassword(password, storedPassword);
        if (!isValid) {
            recordLoginAttempt(normalizedEmail);
            return { user: null, error: GENERIC_AUTH_ERROR };
        }

        // Migrate plaintext password to hashed on successful login
        if (!isHashedPassword(storedPassword)) {
            const hashed = await hashPassword(password);
            passwords[normalizedEmail] = hashed;
            setPasswords(passwords);
        }

        const user = await db.users.getByEmail(normalizedEmail);
        if (!user) {
            return { user: null, error: GENERIC_AUTH_ERROR };
        }

        clearLoginAttempts(normalizedEmail);
        saveSession(user);
        notifyListeners(user);
        return { user, error: null };
    },

    /**
     * Create a new account.
     * - Validates password strength (8+ chars, uppercase, number, special char)
     * - Hashes password with per-password salt before storing
     */
    register: async (email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> => {
        const normalizedEmail = email.toLowerCase().trim();

        if (!validateEmail(normalizedEmail)) {
            return { user: null, error: 'Please enter a valid email address.' };
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return { user: null, error: passwordCheck.error };
        }

        if (!name || name.trim().length === 0) {
            return { user: null, error: 'Name is required.' };
        }

        const existing = await db.users.getByEmail(normalizedEmail);
        if (existing) {
            return { user: null, error: 'An account with this email already exists.' };
        }

        const user = await db.users.create({
            email: normalizedEmail,
            name: name.trim(),
            role: 'user',
            createdAt: new Date().toISOString(),
            bookmarks: [],
            subscription: 'free',
        });

        // Hash and store password
        const hashed = await hashPassword(password);
        const passwords = getPasswords();
        passwords[normalizedEmail] = hashed;
        setPasswords(passwords);

        // Auto-login
        saveSession(user);
        notifyListeners(user);

        // Welcome notification
        await db.notifications.create({
            userId: user.id,
            title: 'Welcome to HalalBiz SG!',
            message: 'Your account has been created. Start exploring halal businesses in Singapore.',
            type: 'success',
            read: false,
            createdAt: new Date().toISOString(),
        });

        return { user, error: null };
    },

    /**
     * Sign out current user.
     */
    logout: async (): Promise<void> => {
        localStorage.removeItem(AUTH_KEY);
        notifyListeners(null);
    },

    /**
     * Get current logged-in user (synchronous, from session).
     * Returns null if session is expired.
     */
    getCurrentUser: (): User | null => {
        return loadSession();
    },

    /**
     * Refresh user data from DB (call after profile updates).
     */
    refreshSession: async (): Promise<User | null> => {
        const current = auth.getCurrentUser();
        if (!current) return null;
        const fresh = await db.users.getById(current.id);
        if (fresh) {
            saveSession(fresh);
            notifyListeners(fresh);
        }
        return fresh;
    },

    /**
     * Subscribe to auth state changes.
     */
    onAuthStateChange: (callback: AuthListener): (() => void) => {
        listeners.push(callback);
        return () => {
            const idx = listeners.indexOf(callback);
            if (idx !== -1) listeners.splice(idx, 1);
        };
    },

    /**
     * Update password.
     * - Validates old password (supports hashed and legacy plaintext)
     * - Enforces strength requirements on new password
     * - Stores new password hashed
     */
    updatePassword: async (email: string, oldPassword: string, newPassword: string): Promise<{ error: string | null }> => {
        const normalizedEmail = email.toLowerCase().trim();
        const passwords = getPasswords();
        const stored = passwords[normalizedEmail];

        if (!stored) {
            return { error: GENERIC_AUTH_ERROR };
        }

        const isValid = await verifyPassword(oldPassword, stored);
        if (!isValid) {
            return { error: 'Current password is incorrect.' };
        }

        const passwordCheck = validatePassword(newPassword);
        if (!passwordCheck.valid) {
            return { error: passwordCheck.error };
        }

        const hashed = await hashPassword(newPassword);
        passwords[normalizedEmail] = hashed;
        setPasswords(passwords);
        return { error: null };
    },

    /**
     * Request password reset (stub for Supabase migration).
     * In demo mode, returns a user-friendly message.
     * After Supabase migration: supabase.auth.resetPasswordForEmail(email)
     */
    requestPasswordReset: async (_email: string): Promise<{ error: string | null }> => {
        return { error: 'Password reset is not available in demo mode. Please contact support.' };
    },
};
