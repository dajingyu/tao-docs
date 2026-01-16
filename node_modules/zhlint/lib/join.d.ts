import { IgnoredMark } from './ignore.js';
import { Validation } from './report.js';
import { MutableGroupToken as GroupToken, MutableToken as Token } from './parser/index.js';
/**
 * Join tokens back into string
 * @param tokens the target group token, the index is relative to the block it belongs to
 * @param offset the index of the block, relative to the file it belongs to
 * @param ignoredMarks the ignored marks, the index is relative to the block it belongs to
 * @param validations the validation list result
 * @param isChild whether the group token is a child token of the block
 */
declare const join: (tokens: GroupToken, offset?: number, ignoredMarks?: IgnoredMark[], ignoredTokens?: Token[], validations?: Validation[], ignoredValidations?: Validation[], isChild?: boolean) => string;
export default join;
//# sourceMappingURL=join.d.ts.map