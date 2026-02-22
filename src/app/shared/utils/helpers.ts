/**
 * Shared utility functions for the JobFinder application.
 */

/**
 * Truncate a string to a given length, appending '...' if truncated.
 */
export function truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format a salary number as a French locale string.
 */
export function formatSalary(value: number, currency = '€'): string {
    return `${Math.round(value).toLocaleString('fr-FR')} ${currency}`;
}

/**
 * Check whether a given string is a valid email.
 */
export function isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/**
 * Generate a unique ID string (simple UUID-like function).
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
