/**
 * Auth Service - localStorage-backed, Supabase-ready interface.
 *
 * To migrate to Supabase, replace with:
 *   import { createClient } from '@supabase/supabase-js'
 *   const supabase = createClient(url, key)
 *   supabase.auth.signInWithPassword({ email, password })
 */

import { User } from '../types';
import * as db from './db';

const AUTH_KEY = 'hb_auth_session';
const PASSWORDS_KEY = 'hb_passwords'; // localStorage-only, Supabase handles this natively

type AuthListener = (user: User | null) => void;
const listeners: AuthListener[] = [];

function getPasswords(): Record<string, string> {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
}

function setPasswords(data: Record<string, string>) {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(data));
}

function notifyListeners(user: User | null) {
    listeners.forEach(fn => fn(user));
}

export const auth = {
    /**
     * Sign in with email and password.
     */
    login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
        const passwords = getPasswords();
        const storedPassword = passwords[email.toLowerCase()];

        if (!storedPassword) {
            return { user: null, error: 'No account found with this email.' };
        }
        if (storedPassword !== password) {
            return { user: null, error: 'Incorrect password.' };
        }

        const user = await db.users.getByEmail(email.toLowerCase());
        if (!user) {
            return { user: null, error: 'Account data not found.' };
        }

        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        notifyListeners(user);
        return { user, error: null };
    },

    /**
     * Create a new account.
     */
    register: async (email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> => {
        const existing = await db.users.getByEmail(email.toLowerCase());
        if (existing) {
            return { user: null, error: 'An account with this email already exists.' };
        }

        if (password.length < 6) {
            return { user: null, error: 'Password must be at least 6 characters.' };
        }

        const user = await db.users.create({
            email: email.toLowerCase(),
            name,
            role: 'user',
            createdAt: new Date().toISOString(),
            bookmarks: [],
            subscription: 'free',
        });

        // Store password
        const passwords = getPasswords();
        passwords[email.toLowerCase()] = password;
        setPasswords(passwords);

        // Auto-login
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
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
     */
    getCurrentUser: (): User | null => {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    /**
     * Refresh user data from DB (call after profile updates).
     */
    refreshSession: async (): Promise<User | null> => {
        const current = auth.getCurrentUser();
        if (!current) return null;
        const fresh = await db.users.getById(current.id);
        if (fresh) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(fresh));
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
     */
    updatePassword: async (email: string, oldPassword: string, newPassword: string): Promise<{ error: string | null }> => {
        const passwords = getPasswords();
        if (passwords[email.toLowerCase()] !== oldPassword) {
            return { error: 'Current password is incorrect.' };
        }
        if (newPassword.length < 6) {
            return { error: 'New password must be at least 6 characters.' };
        }
        passwords[email.toLowerCase()] = newPassword;
        setPasswords(passwords);
        return { error: null };
    },
};
