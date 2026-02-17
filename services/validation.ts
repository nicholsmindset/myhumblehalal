/**
 * Input validation utilities for backend services.
 * Manual validators — no external dependencies (e.g. Zod) required.
 */

// ── Password validation ──

export interface PasswordValidationResult {
    valid: boolean;
    error: string | null;
}

export function validatePassword(password: string): PasswordValidationResult {
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one special character.' };
    }
    return { valid: true, error: null };
}

// ── Email validation ──

export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Generic string sanitization ──

const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
};

export function sanitizeString(input: string): string {
    return input.replace(/[&<>"']/g, ch => HTML_ENTITIES[ch] || ch);
}

// ── Business validation ──

export interface ValidationError {
    field: string;
    message: string;
}

export function validateBusinessData(data: Record<string, unknown>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Business name is required.' });
    }
    if (typeof data.name === 'string' && data.name.length > 200) {
        errors.push({ field: 'name', message: 'Business name must be under 200 characters.' });
    }
    if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
        errors.push({ field: 'address', message: 'Address is required.' });
    }
    if (!data.category || typeof data.category !== 'string') {
        errors.push({ field: 'category', message: 'Category is required.' });
    }
    if (data.rating !== undefined) {
        const rating = Number(data.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
            errors.push({ field: 'rating', message: 'Rating must be between 0 and 5.' });
        }
    }
    if (data.phone && typeof data.phone === 'string' && !/^\+?[\d\s\-()]{6,20}$/.test(data.phone)) {
        errors.push({ field: 'phone', message: 'Invalid phone number format.' });
    }
    if (data.email && typeof data.email === 'string' && !validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format.' });
    }
    if (data.website && typeof data.website === 'string') {
        try {
            new URL(data.website);
        } catch {
            errors.push({ field: 'website', message: 'Invalid website URL.' });
        }
    }

    return errors;
}

// ── Review validation ──

export function validateReviewData(data: Record<string, unknown>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.businessId || typeof data.businessId !== 'string') {
        errors.push({ field: 'businessId', message: 'Business ID is required.' });
    }
    if (!data.userName || typeof data.userName !== 'string' || data.userName.trim().length === 0) {
        errors.push({ field: 'userName', message: 'User name is required.' });
    }
    if (data.rating === undefined || data.rating === null) {
        errors.push({ field: 'rating', message: 'Rating is required.' });
    } else {
        const rating = Number(data.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            errors.push({ field: 'rating', message: 'Rating must be between 1 and 5.' });
        }
    }
    if (!data.comment || typeof data.comment !== 'string' || data.comment.trim().length === 0) {
        errors.push({ field: 'comment', message: 'Review comment is required.' });
    }
    if (typeof data.comment === 'string' && data.comment.length > 2000) {
        errors.push({ field: 'comment', message: 'Review must be under 2000 characters.' });
    }

    return errors;
}

// ── Event validation ──

export function validateEventData(data: Record<string, unknown>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Event title is required.' });
    }
    if (!data.date || typeof data.date !== 'string') {
        errors.push({ field: 'date', message: 'Event date is required.' });
    }
    if (!data.location || typeof data.location !== 'string' || data.location.trim().length === 0) {
        errors.push({ field: 'location', message: 'Event location is required.' });
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Event description is required.' });
    }
    if (data.price !== undefined && data.price !== null) {
        const price = Number(data.price);
        if (isNaN(price) || price < 0) {
            errors.push({ field: 'price', message: 'Price must be a positive number.' });
        }
    }

    return errors;
}
