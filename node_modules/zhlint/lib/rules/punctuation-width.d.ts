/**
 * @fileoverview
 *
 * This rule will format each punctuation into the right width options.
 *
 * Options:
 * - halfwidthPunctuation: string = `()[]{}`
 * - fullwidthPunctuation: string = `，。：；？！“”‘’`
 * - adjustedFullwidthPunctuation: string = `“”‘’`
 *
 * Details:
 * - skip half-width punctuations between half-width content without space
 * - skip successive multiple half-width punctuations
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=punctuation-width.d.ts.map