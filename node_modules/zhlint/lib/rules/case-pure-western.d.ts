/**
 * @fileoverview
 *
 * This rule is resetting all the validations in sentences which are full of
 * western letters and punctuations.
 *
 * Options
 * - skipPureWestern: boolean | undefined
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=case-pure-western.d.ts.map