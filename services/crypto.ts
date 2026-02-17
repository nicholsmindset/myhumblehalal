/**
 * Browser-native cryptographic utilities using Web Crypto API.
 * No external dependencies required.
 *
 * Passwords are stored as: sha256$<salt>$<hash>
 * Legacy plaintext passwords are auto-migrated on first login.
 */

const HASH_ALGORITHM = 'SHA-256';
const HASH_PREFIX = 'sha256';
const SEPARATOR = '$';

export function generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt?: string): Promise<string> {
    const useSalt = salt ?? generateSalt();
    const encoder = new TextEncoder();
    const data = encoder.encode(useSalt + password);
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, data);
    const hashHex = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
    return `${HASH_PREFIX}${SEPARATOR}${useSalt}${SEPARATOR}${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    if (!isHashedPassword(stored)) {
        // Legacy plaintext — direct comparison (will be migrated after successful login)
        return password === stored;
    }
    const parts = stored.split(SEPARATOR);
    if (parts.length !== 3) return false;
    const [, salt] = parts;
    const computed = await hashPassword(password, salt);
    return computed === stored;
}

export function isHashedPassword(stored: string): boolean {
    return stored.startsWith(HASH_PREFIX + SEPARATOR);
}
