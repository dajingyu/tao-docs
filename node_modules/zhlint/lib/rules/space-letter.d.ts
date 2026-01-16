/**
 * @fileoverview
 *
 * This rule is used to check whether there should be a space between
 * content.
 *
 * Options:
 * - spaceBetweenHalfwidthContent: boolean | undefined
 *   - `true`: ensure one space between half-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - noSpaceBetweenFullwidthContent: boolean | undefined
 *   - `true`: remove the space between full-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - spaceBetweenMixedwidthContent: boolean | undefined
 *   - `true`: keep one space between width-mixed content (default)
 *   - `false`: no space between width-mixed content
 *   - `undefined`: do nothing, just keep the original format
 *
 * Examples (betweenMixedWidthContent = true):
 * - *a*啊 -> *a* 啊
 * - *a *啊 -> *a* 啊
 * - *啊*a -> *啊* a
 * - *啊 *a -> *啊* a
 *
 * Examples (betweenMixedWidthContent = false):
 * - *a* 啊 -> *a*啊
 * - *a *啊 -> *a*啊
 * - *啊* a -> *啊*a
 * - *啊 *a -> *啊*a
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-letter.d.ts.map