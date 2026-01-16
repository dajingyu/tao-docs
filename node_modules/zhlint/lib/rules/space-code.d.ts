/**
 * @fileoverview
 *
 * This rule will decide whether to keep a space outside inline code with
 * content like:
 * - xxx `foo` xxx
 * - xxx <code>foo</code> xxx
 * in markdown/html.
 *
 * Options:
 * - spaceOutsideCode: boolean | undefined
 *   - `true`: keep one space outside (default)
 *   - `false`: no space outside
 *   - `undefined`: do nothing, just keep the original format
 *
 * Details:
 * - code x code
 * - content x code
 * - code x content
 */
import { Options } from './util.js';
import { Handler } from '../parser/index.js';
declare const generateHandler: (options: Options) => Handler;
export declare const defaultConfig: Options;
export default generateHandler;
//# sourceMappingURL=space-code.d.ts.map