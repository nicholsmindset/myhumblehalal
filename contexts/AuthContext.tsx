import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User } from '../types';
import { auth } from '../services/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => auth.getCurrentUser());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsub = auth.onAuthStateChange((u) => setUser(u));
        return unsub;
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const result = await auth.login(email, password);
        setLoading(false);
        return { error: result.error };
    };

    const register = async (email: string, password: string, name: string) => {
        setLoading(true);
        const result = await auth.register(email, password, name);
        setLoading(false);
        return { error: result.error };
    };

    const logout = async () => {
        await auth.logout();
    };

    const refreshUser = async () => {
        await auth.refreshSession();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
