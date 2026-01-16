/**
 * @fileoverview
 *
 * This rule is checking spaces besides brackets.
 *
 * Options
 * - noSpaceInsideBracket: boolean | undefined
 * - spaceOutsideHalfBracket: boolean | undefined
 * - nospaceOutsideFullBracket: boolean | undefined
 *
 * Details:
 * - noSpaceInsideBracket:
 *   - left-bracket x anything
 *   - non-left-bracket x right-bracket
 * - spaceOutsideHalfBracket:
 *   - right-half-bracket x left-half-bracket
 *   - right-half-bracket x content/left-quotation/code
 *   - content/right-quotation/code x left-half-bracket
 * - noSpaceOutsideFullBracket:
 *   - right-full-bracket x left-full-bracket
 *   - right-full-bracket x content/left-quotation/code
 *   - content/right-quotation/code x left-full-bracket
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-bracket.d.ts.map