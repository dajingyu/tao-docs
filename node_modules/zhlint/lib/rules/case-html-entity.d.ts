/**
 * @fileoverview
 *
 * This rule is used to revert changes of HTML entities.
 *
 * Details:
 * - to match `&<half-width-content>;`
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=case-html-entity.d.ts.map