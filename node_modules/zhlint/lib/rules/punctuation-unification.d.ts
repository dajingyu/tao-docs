/**
 * @fileoverview
 *
 * This rule will unify similar punctuations into the same one.
 * Usually, it's just about Chinese quotations.
 *
 * Options:
 * - unifiedPunctuation: "traditional" | "simplified" | Record<string, boolean | string[]> & { default: boolean }
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=punctuation-unification.d.ts.map