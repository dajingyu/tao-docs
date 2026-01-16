import { ValidationTarget } from '../report.js';
import { MarkSideType, MutableGroupToken as GroupToken, MutableToken as Token, TokenType } from '../parser/index.js';
export type Options = {
    noSinglePair?: boolean;
    halfwidthPunctuation?: string;
    fullwidthPunctuation?: string;
    adjustedFullwidthPunctuation?: string;
    unifiedPunctuation?: 'traditional' | 'simplified' | (Record<string, boolean | string[]> & {
        default: boolean;
    });
    skipAbbrs?: string[];
    spaceBetweenHalfwidthContent?: boolean;
    noSpaceBetweenFullwidthContent?: boolean;
    spaceBetweenMixedwidthContent?: boolean;
    noSpaceBeforePauseOrStop?: boolean;
    spaceAfterHalfwidthPauseOrStop?: boolean;
    noSpaceAfterFullwidthPauseOrStop?: boolean;
    spaceOutsideHalfwidthQuotation?: boolean;
    noSpaceOutsideFullwidthQuotation?: boolean;
    noSpaceInsideQuotation?: boolean;
    spaceOutsideHalfwidthBracket?: boolean;
    noSpaceOutsideFullwidthBracket?: boolean;
    noSpaceInsideBracket?: boolean;
    spaceOutsideCode?: boolean;
    noSpaceInsideHyperMark?: boolean;
    trimSpace?: boolean;
    skipZhUnits?: string;
    skipPureWestern?: boolean;
    preset?: string;
} & DeprecatedOptions;
export type DeprecatedOptions = {
    /**
     * @deprecated
     *
     * Please use `halfwidthPunctuation` instead.
     */
    halfWidthPunctuation?: string;
    /**
     * @deprecated
     *
     * Please use `fullwidthPunctuation` instead.
     */
    fullWidthPunctuation?: string;
    /**
     * @deprecated
     *
     * Please use `adjustedFullwidthPunctuation` instead.
     */
    adjustedFullWidthPunctuation?: string;
    /**
     * @deprecated
     *
     * Please use `spaceBetweenHalfwidthContent` instead.
     */
    spaceBetweenHalfWidthLetters?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceBetweenHalfwidthContent` instead.
     */
    spaceBetweenHalfWidthContent?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceBetweenFullwidthContent` instead.
     */
    noSpaceBetweenFullWidthLetters?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceBetweenFullwidthContent` instead.
     */
    noSpaceBetweenFullWidthContent?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceBetweenMixedwidthContent` instead.
     */
    spaceBetweenMixedWidthLetters?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceBetweenMixedwidthContent` instead.
     */
    spaceBetweenMixedWidthContent?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceBeforePauseOrStop` instead.
     */
    noSpaceBeforePunctuation?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceAfterHalfwidthPauseOrStop` instead.
     */
    spaceAfterHalfWidthPunctuation?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceAfterFullwidthPauseOrStop` instead.
     */
    noSpaceAfterFullWidthPunctuation?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceOutsideHalfwidthQuotation` instead.
     */
    spaceOutsideHalfQuote?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceOutsideFullwidthQuotation` instead.
     */
    noSpaceOutsideFullQuote?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceInsideQuotation` instead.
     */
    noSpaceInsideQuote?: boolean;
    /**
     * @deprecated
     *
     * Please use `spaceOutsideHalfwidthBracket` instead.
     */
    spaceOutsideHalfBracket?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceOutsideFullwidthBracket` instead.
     */
    noSpaceOutsideFullBracket?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceInsideHyperMark` instead.
     */
    noSpaceInsideWrapper?: boolean;
    /**
     * @deprecated
     *
     * Please use `noSpaceInsideHyperMark` instead.
     */
    noSpaceInsideMark?: boolean;
};
/**
 * Find the previous token if exists
 */
export declare const findTokenBefore: (group: GroupToken, token: Token | undefined) => Token | undefined;
/**
 * Find the next token if exists
 */
export declare const findTokenAfter: (group: GroupToken, token: Token | undefined) => Token | undefined;
/**
 * Find a certain token before, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export declare const findNonCodeVisibleTokenBefore: (group: GroupToken, token: Token | undefined) => Token | undefined;
/**
 * Find a certain token after, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export declare const findNonCodeVisibleTokenAfter: (group: GroupToken, token: Token | undefined) => Token | undefined;
/**
 * Find a certain token before, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export declare const findVisibleTokenBefore: (group: GroupToken, token: Token | undefined) => Token | undefined;
/**
 * Find a certain token after, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export declare const findVisibleTokenAfter: (group: GroupToken, token: Token | undefined) => Token | undefined;
export declare const isWrapper: (token: Token) => boolean;
export declare const getWrapperSide: (token: Token) => MarkSideType | undefined;
export declare const findConnectedWrappers: (group: GroupToken, token: Token) => Token[];
export declare const findWrappersBetween: (group: GroupToken, before: Token | undefined, after: Token | undefined) => {
    spaceHost?: Token | undefined;
    wrappers: Token[];
    tokens: Token[];
};
export declare const isHalfwidthPunctuationWithoutSpaceAround: (group: GroupToken, token: Token) => boolean;
export declare const isSuccessiveHalfwidthPunctuation: (group: GroupToken, token: Token) => boolean;
export declare const setValidationOnTarget: (token: Token, target: ValidationTarget, message: string, name: string) => void;
export declare const hasValidationOnTarget: (token: Token, target: ValidationTarget) => boolean;
export declare const removeValidationOnTarget: (token: Token, target: ValidationTarget) => void;
type Checker = (token: Token, value: string, message: string) => void;
export declare const checkSpaceAfter: Checker;
export declare const checkStartValue: Checker;
export declare const checkEndValue: Checker;
export declare const checkInnerSpaceBefore: Checker;
export declare const checkValue: (token: Token, value: string, type: TokenType | undefined, message: string) => void;
export {};
//# sourceMappingURL=util.d.ts.map