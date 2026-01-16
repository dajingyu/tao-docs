/**
 * @fileoverview
 *
 * This rule is used to revert changes of spaceAfter with linebreaks.
 * And it's compulsory.
 */
import { Handler } from '../parser/index.js';
import { Options } from './util.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=case-linebreak.d.ts.map