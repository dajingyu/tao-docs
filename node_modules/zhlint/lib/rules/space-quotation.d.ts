/**
 * @fileoverview
 *
 * This rule is checking spaces besides quotations.
 *
 * Options
 * - noSpaceInsideQuotation: boolean | undefined
 * - spaceOutsideHalfwidthQuotation: boolean | undefined
 * - noSpaceOutsideFullwidthQuotation: boolean | undefined
 *
 * Details:
 * - noSpaceInsideQuotation:
 *   - left-quotation x right-quotation
 *   - content/punctuation/right-quotation/right-bracket/code/unknown/container x right-quotation
 *   - left-quotation x content/punctuation/left-quotation/left-bracket/code/unknown/container
 * - spaceOutsideHalfwidthQuotation:
 *   - right-half-quotation x left-half-quotation
 *   - content/code x left-half-quotation
 *   - right-half-quotation x content/code
 * - noSpaceOutsideFullwidthQuotation:
 *   - right-full-quotation x left-full-quotation
 *   - content/code x left-full-quotation
 *   - right-full-quotation x content/code
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-quotation.d.ts.map