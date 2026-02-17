import { describe, it, expect } from 'vitest';
import {
    validatePassword,
    validateEmail,
    sanitizeString,
    validateBusinessData,
    validateReviewData,
    validateEventData,
} from '../validation';

describe('validation', () => {
    describe('validatePassword', () => {
        it('rejects passwords shorter than 8 chars', () => {
            const result = validatePassword('Aa1!');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('8 characters');
        });

        it('rejects passwords without uppercase', () => {
            const result = validatePassword('abcdef1!');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('uppercase');
        });

        it('rejects passwords without a number', () => {
            const result = validatePassword('Abcdefg!');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('number');
        });

        it('rejects passwords without a special character', () => {
            const result = validatePassword('Abcdefg1');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('special character');
        });

        it('accepts valid passwords', () => {
            const result = validatePassword('MyPassword1!');
            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    describe('validateEmail', () => {
        it('accepts valid emails', () => {
            expect(validateEmail('user@example.com')).toBe(true);
            expect(validateEmail('name+tag@domain.co')).toBe(true);
        });

        it('rejects invalid emails', () => {
            expect(validateEmail('')).toBe(false);
            expect(validateEmail('not-an-email')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
            expect(validateEmail('user@')).toBe(false);
        });
    });

    describe('sanitizeString', () => {
        it('escapes HTML entities', () => {
            expect(sanitizeString('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
            );
        });

        it('leaves normal text unchanged', () => {
            expect(sanitizeString('Hello World')).toBe('Hello World');
        });
    });

    describe('validateBusinessData', () => {
        const validBusiness = {
            name: 'Test Business',
            address: '123 Test St',
            category: 'Food & Beverage',
            rating: 4.5,
        };

        it('passes for valid data', () => {
            expect(validateBusinessData(validBusiness)).toEqual([]);
        });

        it('requires name', () => {
            const errors = validateBusinessData({ ...validBusiness, name: '' });
            expect(errors.some(e => e.field === 'name')).toBe(true);
        });

        it('requires address', () => {
            const errors = validateBusinessData({ ...validBusiness, address: '' });
            expect(errors.some(e => e.field === 'address')).toBe(true);
        });

        it('validates rating bounds', () => {
            const errors = validateBusinessData({ ...validBusiness, rating: 6 });
            expect(errors.some(e => e.field === 'rating')).toBe(true);
        });

        it('validates phone format', () => {
            const errors = validateBusinessData({ ...validBusiness, phone: 'abc' });
            expect(errors.some(e => e.field === 'phone')).toBe(true);
        });

        it('validates website URL', () => {
            const errors = validateBusinessData({ ...validBusiness, website: 'not-a-url' });
            expect(errors.some(e => e.field === 'website')).toBe(true);
        });
    });

    describe('validateReviewData', () => {
        const validReview = {
            businessId: 'biz_1',
            userName: 'Test User',
            rating: 5,
            comment: 'Great place!',
        };

        it('passes for valid data', () => {
            expect(validateReviewData(validReview)).toEqual([]);
        });

        it('requires businessId', () => {
            const errors = validateReviewData({ ...validReview, businessId: '' });
            expect(errors.some(e => e.field === 'businessId')).toBe(true);
        });

        it('validates rating is 1-5', () => {
            expect(validateReviewData({ ...validReview, rating: 0 }).some(e => e.field === 'rating')).toBe(true);
            expect(validateReviewData({ ...validReview, rating: 6 }).some(e => e.field === 'rating')).toBe(true);
        });

        it('rejects overly long comments', () => {
            const errors = validateReviewData({ ...validReview, comment: 'x'.repeat(2001) });
            expect(errors.some(e => e.field === 'comment')).toBe(true);
        });
    });

    describe('validateEventData', () => {
        const validEvent = {
            title: 'Test Event',
            date: '2025-01-01',
            location: 'Test Venue',
            description: 'A test event',
        };

        it('passes for valid data', () => {
            expect(validateEventData(validEvent)).toEqual([]);
        });

        it('requires title', () => {
            const errors = validateEventData({ ...validEvent, title: '' });
            expect(errors.some(e => e.field === 'title')).toBe(true);
        });

        it('validates price is non-negative', () => {
            const errors = validateEventData({ ...validEvent, price: -10 });
            expect(errors.some(e => e.field === 'price')).toBe(true);
        });
    });
});
