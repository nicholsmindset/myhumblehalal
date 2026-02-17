import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, isHashedPassword, generateSalt } from '../crypto';

describe('crypto', () => {
    describe('generateSalt', () => {
        it('returns a 32-character hex string', () => {
            const salt = generateSalt();
            expect(salt).toMatch(/^[0-9a-f]{32}$/);
        });

        it('produces unique salts', () => {
            const a = generateSalt();
            const b = generateSalt();
            expect(a).not.toBe(b);
        });
    });

    describe('hashPassword', () => {
        it('returns sha256$salt$hash format', async () => {
            const hash = await hashPassword('test123');
            const parts = hash.split('$');
            expect(parts).toHaveLength(3);
            expect(parts[0]).toBe('sha256');
            expect(parts[1]).toMatch(/^[0-9a-f]{32}$/); // salt
            expect(parts[2]).toMatch(/^[0-9a-f]{64}$/); // SHA-256 hex
        });

        it('produces different hashes for the same password (random salt)', async () => {
            const a = await hashPassword('test123');
            const b = await hashPassword('test123');
            expect(a).not.toBe(b);
        });

        it('produces the same hash with an explicit salt', async () => {
            const salt = generateSalt();
            const a = await hashPassword('test123', salt);
            const b = await hashPassword('test123', salt);
            expect(a).toBe(b);
        });
    });

    describe('verifyPassword', () => {
        it('returns true for correct password', async () => {
            const hash = await hashPassword('myPassword1!');
            expect(await verifyPassword('myPassword1!', hash)).toBe(true);
        });

        it('returns false for incorrect password', async () => {
            const hash = await hashPassword('myPassword1!');
            expect(await verifyPassword('wrongPassword', hash)).toBe(false);
        });

        it('handles legacy plaintext passwords', async () => {
            expect(await verifyPassword('admin123', 'admin123')).toBe(true);
            expect(await verifyPassword('wrong', 'admin123')).toBe(false);
        });
    });

    describe('isHashedPassword', () => {
        it('detects hashed passwords', async () => {
            const hash = await hashPassword('test');
            expect(isHashedPassword(hash)).toBe(true);
        });

        it('detects plaintext passwords', () => {
            expect(isHashedPassword('admin123')).toBe(false);
            expect(isHashedPassword('password')).toBe(false);
        });
    });
});
