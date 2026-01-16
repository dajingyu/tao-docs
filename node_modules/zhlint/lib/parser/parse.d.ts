import { Validation } from '../report.js';
import { Mark, MutableMark, MutableGroupToken, Token, GroupToken } from './types.js';
import { Options as RuleOptions } from '../rules/util.js';
export type ParseStatus = {
    lastToken?: Token;
    lastGroup?: GroupToken;
    lastMark?: Mark;
    tokens: GroupToken;
    marks: Mark[];
    groups: GroupToken[];
    markStack: Mark[];
    groupStack: GroupToken[];
    errors: Validation[];
};
export type ParseResult = {
    tokens: GroupToken;
    groups: GroupToken[];
    marks: Mark[];
    errors: Validation[];
};
export type MutableParseResult = {
    tokens: MutableGroupToken;
    groups: MutableGroupToken[];
    marks: MutableMark[];
    errors: Validation[];
};
/**
 * Parse a string into several tokens.
 * - half-width content x {1,n} (English words)
 * - full-width content x {1,n} (Chinese sentenses without punctuations in between)
 * - half-width punctuation -> halfwidth pause or stop punctuation mark
 * - width-width punctuation -> fullwidth pause or stop punctuation mark
 * - punctuation pair as special marks: brackets -> bracket
 * - punctuation pair as a group: quotations -> quotation or book title mark
 * - -> halfwidth/fullwidth other punctuation mark
 * Besides them there are some special tokens
 * - content-hyper from hyperMarks as input
 * For spaces they would be included as one or multiple successive spaces in
 * - afterSpace after a token or
 * - innerSpaceBefore after the left quotation of a group
 */
export declare const parse: (str: string, hyperMarks?: Mark[]) => ParseResult;
export declare const toMutableResult: (result: ParseResult, options?: RuleOptions) => MutableParseResult;
//# sourceMappingURL=parse.d.ts.map