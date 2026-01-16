import { CharType } from './types.js';
/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * Refs:
 * - https://unicode.org/charts/
 * - https://jrgraphix.net/research/unicode.php
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://stackoverflow.com/a/21113538
 * - https://www.w3.org/International/clreq/#categories_and_usage_of_punctuation_marks
 */
export declare const checkCharType: (char: string) => CharType;
//# sourceMappingURL=char.d.ts.map