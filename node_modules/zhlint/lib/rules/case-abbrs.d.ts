/**
 * @fileoverview
 *
 * This rule is used to revert changes of abbreviations.
 *
 * Details:
 * - the point is rever the trailing dot
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=case-abbrs.d.ts.map