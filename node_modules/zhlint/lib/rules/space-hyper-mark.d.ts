/**
 * @fileoverview
 *
 * This rule is to ensure all the existing spaces should be outside hyper
 * marks like *, _, [, ], etc.
 *
 * Options:
 * - noSpaceInsideMark: boolean | undefined
 *
 * For example:
 * - `x _ ** yyy ** _ z` should be `x _**yyy**_ z`
 *
 * Details:
 * - left-mark x left-mark: `x _ **yyy**_ z`
 *                             ^^^
 * - right-mark x right-mark: `x _**yyy** _ z`
 *                                      ^^^
 * - left-mark x non-mark: `x _** yyy**_ z`
 *                              ^^^
 * - non-mark x right-mark: `x _**yyy **_ z`
 *                                 ^^^
 */
import { Options } from './util.js';
import { Handler } from '../parser/index.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-hyper-mark.d.ts.map