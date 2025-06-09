// File: src/lib/utils.ts

/**
 * Conditionally join class names together.
 * Filters out falsy values (undefined, null, false, '').
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  