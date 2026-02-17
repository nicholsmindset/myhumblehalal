/**
 * Auth Service – Supabase implementation.
 * API signatures are identical to the previous localStorage version.
 *
 * Key differences from localStorage version:
 *  - Passwords are managed by Supabase Auth (never stored client-side)
 *  - Session persists across page refreshes automatically
 *  - onAuthStateChange fires on every tab/window as well
 */

import { supabase } from '../src/lib/supabase';
import { User } from '../types';

type AuthListener = (user: User | null) => void;
const listeners: AuthListener[] = [];

// Module-level cache so getCurrentUser() stays synchronous
let _currentUser: User | null = null;

// ── Internal helpers ─────────────────────────────────────────────────────────

async function profileToUser(userId: string): Promise<User | null> {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error || !profile) return null;

    const { data: bookmarkRows } = await supabase
        .from('bookmarks')
        .select('business_id')
        .eq('user_id', userId);

    return {
        id:                  profile.id,
        email:               profile.email,
        name:                profile.name,
        avatar:              profile.avatar              ?? undefined,
        role:                profile.role,
        phone:               profile.phone               ?? undefined,
        createdAt:           profile.created_at,
        bookmarks:           bookmarkRows?.map(b => b.business_id) ?? [],
        subscription:        profile.subscription,
        subscriptionStatus:  profile.subscription_status ?? undefined,
        subscriptionExpiry:  profile.subscription_expiry ?? undefined,
    };
}

function notifyListeners(user: User | null) {
    _currentUser = user;
    listeners.forEach(fn => fn(user));
}

// ── Wire up Supabase auth state → module cache ───────────────────────────────
//
// This runs once when the module is imported. It:
//  1. Hydrates _currentUser from any existing session (e.g. page refresh)
//  2. Keeps _currentUser in sync with every subsequent sign-in / sign-out

supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session?.user) {
        _currentUser = await profileToUser(session.user.id);
        // Notify after initial hydration so AuthContext picks it up
        notifyListeners(_currentUser);
    }
});

supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
        const user = await profileToUser(session.user.id);
        notifyListeners(user);
    } else {
        notifyListeners(null);
    }
});

// ── Public API ────────────────────────────────────────────────────────────────

export const auth = {
    /**
     * Sign in with email and password.
     */
    login: async (
        email: string,
        password: string,
    ): Promise<{ user: User | null; error: string | null }> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
        });
        if (error) return { user: null, error: error.message };
        if (!data.user) return { user: null, error: 'Login failed.' };

        const user = await profileToUser(data.user.id);
        return { user, error: null };
    },

    /**
     * Create a new account and auto sign-in.
     */
    register: async (
        email: string,
        password: string,
        name: string,
    ): Promise<{ user: User | null; error: string | null }> => {
        if (password.length < 6) {
            return { user: null, error: 'Password must be at least 6 characters.' };
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password,
            options: { data: { name } },
        });

        if (error) return { user: null, error: error.message };
        if (!data.user) return { user: null, error: 'Registration failed.' };

        // The DB trigger creates the profile row; update name in case trigger used email prefix
        await supabase
            .from('profiles')
            .update({ name })
            .eq('id', data.user.id);

        // Welcome notification
        await supabase.from('notifications').insert({
            user_id: data.user.id,
            title:   'Welcome to Humble Halal!',
            message: 'Your account has been created. Start exploring halal businesses in Singapore.',
            type:    'success',
        });

        const user = await profileToUser(data.user.id);
        return { user, error: null };
    },

    /**
     * Sign out current user.
     */
    logout: async (): Promise<void> => {
        await supabase.auth.signOut();
        // onAuthStateChange will call notifyListeners(null)
    },

    /**
     * Get current logged-in user synchronously from the module cache.
     * Cache is hydrated on module load and kept current by onAuthStateChange.
     */
    getCurrentUser: (): User | null => _currentUser,

    /**
     * Re-fetch user data from DB (call after profile updates).
     */
    refreshSession: async (): Promise<User | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const user = await profileToUser(session.user.id);
        notifyListeners(user);
        return user;
    },

    /**
     * Subscribe to auth state changes.
     * Returns an unsubscribe function.
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
     * Supabase verifies the session; old password check is handled server-side
     * via reauthentication if required by your Auth settings.
     */
    updatePassword: async (
        email: string,
        oldPassword: string,
        newPassword: string,
    ): Promise<{ error: string | null }> => {
        if (newPassword.length < 6) {
            return { error: 'New password must be at least 6 characters.' };
        }
        // Re-authenticate to verify old password before updating
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: oldPassword,
        });
        if (authError) return { error: 'Current password is incorrect.' };

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error?.message ?? null };
    },
};
