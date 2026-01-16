/**
 * @fileOverview
 *
 * This file contains the types for the parser.
 *
 * - Chars
 * - Pairs
 * - Marks
 * - Tokens
 */
import { Validation } from '../report.js';
export declare enum CharType {
    EMPTY = "empty",
    SPACE = "space",
    WESTERN_LETTER = "western-letter",
    CJK_CHAR = "cjk-char",
    HALFWIDTH_PAUSE_OR_STOP = "halfwidth-pause-or-stop",
    FULLWIDTH_PAUSE_OR_STOP = "fullwidth-pause-or-stop",
    HALFWIDTH_QUOTATION = "halfwidth-quotation",
    FULLWIDTH_QUOTATION = "fullwidth-quotation",
    HALFWIDTH_BRACKET = "halfwidth-bracket",
    FULLWIDTH_BRACKET = "fullwidth-bracket",
    HALFWIDTH_OTHER_PUNCTUATION = "halfwidth-other-punctuation",
    FULLWIDTH_OTHER_PUNCTUATION = "fullwidth-other-punctuation",
    UNKNOWN = "unknown"
}
type CharSet = {
    [setName: string]: string;
};
export declare const BRACKET_CHAR_SET: CharSet;
export declare const QUOTATION_CHAR_SET: CharSet;
export declare const SHORTHAND_CHARS = "'\u2019";
export declare const SHORTHAND_PAIR_SET: CharSet;
export declare const isFullwidthPair: (str: string) => boolean;
type Pair = {
    startIndex: number;
    startValue: string;
    endIndex: number;
    endValue: string;
};
type MutablePair = {
    modifiedStartValue: string;
    ignoredStartValue?: string;
    modifiedEndValue: string;
    ignoredEndValue?: string;
};
/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
export declare enum MarkType {
    /**
     * Brackets
     */
    BRACKETS = "brackets",
    /**
     * Inline Markdown marks
     */
    HYPER = "hyper",
    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     * - Hexo/VuePress container
     * - Other html code
     */
    RAW = "raw"
}
export declare enum MarkSideType {
    LEFT = "left",
    RIGHT = "right"
}
export type Mark = Pair & {
    type: MarkType;
    meta?: string;
};
export type RawMark = Mark & {
    code: MarkSideType;
    rightPair?: RawMark;
};
export type MutableMark = Mark & MutablePair;
export type MutableRawMark = RawMark & MutablePair;
export type MarkMap = {
    [index: number]: Mark;
};
export declare const isRawMark: (mark: Mark) => mark is RawMark;
export type LetterType = CharType.WESTERN_LETTER | CharType.CJK_CHAR;
export type PauseOrStopType = CharType.HALFWIDTH_PAUSE_OR_STOP | CharType.FULLWIDTH_PAUSE_OR_STOP;
export type QuotationType = CharType.HALFWIDTH_QUOTATION | CharType.FULLWIDTH_QUOTATION;
export type BracketType = CharType.HALFWIDTH_BRACKET | CharType.FULLWIDTH_BRACKET;
export type OtherPunctuationType = CharType.HALFWIDTH_OTHER_PUNCTUATION | CharType.FULLWIDTH_OTHER_PUNCTUATION;
export type SinglePunctuationType = PauseOrStopType | OtherPunctuationType;
export type PunctuationType = SinglePunctuationType | BracketType;
export type NormalContentTokenType = LetterType | SinglePunctuationType;
export type HalfwidthPuntuationType = CharType.HALFWIDTH_PAUSE_OR_STOP | CharType.HALFWIDTH_QUOTATION | CharType.HALFWIDTH_BRACKET | CharType.HALFWIDTH_OTHER_PUNCTUATION;
export type FullwidthPuntuationType = CharType.FULLWIDTH_PAUSE_OR_STOP | CharType.FULLWIDTH_QUOTATION | CharType.FULLWIDTH_BRACKET | CharType.FULLWIDTH_OTHER_PUNCTUATION;
export type HalfwidthTokenType = CharType.WESTERN_LETTER | FullwidthPuntuationType;
export type FullwidthTokenType = CharType.CJK_CHAR | FullwidthPuntuationType;
/**
 * TODO: paired html tags should be hyper mark
 */
export declare enum HyperTokenType {
    /**
     * Brackets
     */
    BRACKET_MARK = "bracket-mark",
    /**
     * Inline Markdown marks
     */
    HYPER_MARK = "hyper-mark",
    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     */
    CODE_CONTENT = "code-content",
    /**
     * - Hexo/VuePress container
     * - Other html code
     */
    HYPER_CONTENT = "hyper-content",
    /**
     * Unpaired brackets/quotations
     */
    UNMATCHED = "unmatched",
    /**
     * For indeterminate tokens
     */
    INDETERMINATED = "indeterminated"
}
export declare enum GroupTokenType {
    GROUP = "group"
}
export type SingleTokenType = NormalContentTokenType | HyperTokenType;
export type TokenType = SingleTokenType | GroupTokenType;
export type NonTokenCharType = BracketType | QuotationType | CharType.EMPTY | CharType.SPACE | CharType.UNKNOWN;
export type GeneralType = TokenType | NonTokenCharType;
export declare const getHalfwidthTokenType: (type: TokenType) => TokenType;
export declare const getFullwidthTokenType: (type: TokenType) => TokenType;
export type NonCodeVisibleTokenType = NormalContentTokenType | HyperTokenType.BRACKET_MARK | GroupTokenType.GROUP;
export type VisibleTokenType = NonCodeVisibleTokenType | HyperTokenType.CODE_CONTENT;
export type InvisibleTokenType = HyperTokenType.HYPER_MARK;
export type VisibilityUnknownTokenType = HyperTokenType.HYPER_CONTENT;
export declare const isLetterType: (type: GeneralType) => type is LetterType;
export declare const isPauseOrStopType: (type: GeneralType) => type is PauseOrStopType;
export declare const isQuotationType: (type: GeneralType) => type is QuotationType;
export declare const isBracketType: (type: GeneralType) => type is BracketType;
export declare const isOtherPunctuationType: (type: GeneralType) => type is OtherPunctuationType;
export declare const isSinglePunctuationType: (type: GeneralType) => type is SinglePunctuationType;
export declare const isPunctuationType: (type: GeneralType) => type is PunctuationType;
export declare const isHalfwidthPunctuationType: (type: GeneralType) => type is HalfwidthPuntuationType;
export declare const isHalfwidthType: (type: GeneralType) => type is HalfwidthTokenType;
export declare const isFullwidthPunctuationType: (type: GeneralType) => type is FullwidthPuntuationType;
export declare const isFullwidthType: (type: GeneralType) => type is FullwidthTokenType;
export declare const isNonCodeVisibleType: (type: GeneralType) => type is LetterType;
export declare const isVisibleType: (type: GeneralType) => type is VisibleTokenType;
export declare const isInvisibleType: (type: GeneralType) => type is HyperTokenType.HYPER_MARK;
export declare const isVisibilityUnknownType: (type: GeneralType) => type is HyperTokenType.HYPER_CONTENT;
type CommonToken = {
    index: number;
    length: number;
    value: string;
    spaceAfter: string;
    mark?: Mark;
    markSide?: MarkSideType;
};
type MutableCommonToken = CommonToken & {
    modifiedValue: string;
    ignoredValue?: string;
    modifiedSpaceAfter: string;
    ignoredSpaceAfter?: string;
    validations: Validation[];
};
export type SingleToken = CommonToken & {
    type: SingleTokenType;
};
export type MutableSingleToken = MutableCommonToken & {
    type: SingleTokenType;
    modifiedType: SingleTokenType;
    ignoredType?: SingleTokenType;
};
export type GroupToken = Array<Token> & CommonToken & Pair & {
    type: GroupTokenType;
    innerSpaceBefore: string;
};
export type MutableGroupToken = Array<MutableToken> & MutableCommonToken & Pair & MutablePair & {
    type: GroupTokenType;
    modifiedType: GroupTokenType;
    ignoredType?: GroupTokenType;
    innerSpaceBefore: string;
    modifiedInnerSpaceBefore: string;
    ignoredInnerSpaceBefore?: string;
};
export type Token = SingleToken | GroupToken;
export type MutableToken = MutableSingleToken | MutableGroupToken;
export {};
//# sourceMappingURL=types.d.ts.map