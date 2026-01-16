/**
 * @fileoverview
 *
 * This rule is checking spaces besides normal punctuations.
 * Usually, for full-width punctuations, we don't need any spaces around.
 * For half-width punctuations, we need a space after that.
 *
 * Options
 * - noSpaceBeforePunctuation: boolean | undefined
 *   - `true`: remove spaces before a half-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - spaceAfterHalfWidthPunctuation: boolean | undefined
 *   - `true`: ensure one space after a half-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - noSpaceAfterFullWidthPunctuation: boolean | undefined
 *   - `true`: remove spaces around a full-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 *
 * Details:
 * - noSpaceBeforePunctuation:
 *   content/right-quotation/right-bracket/code x punctuation
 * - spaceAfterHalfWidthPunctuation:
 *   half x content/left-quotation/left-bracket/code
 * - noSpaceAfterFullWidthPunctuation:
 *   full x content/left-quotation/left-bracket/code
 *
 * - skip half-width punctuations between half-width content without space
 * - skip successive multiple half-width punctuations
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-punctuation.d.ts.map