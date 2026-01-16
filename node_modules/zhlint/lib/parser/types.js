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
// Char
export var CharType;
(function (CharType) {
    CharType["EMPTY"] = "empty";
    CharType["SPACE"] = "space";
    CharType["WESTERN_LETTER"] = "western-letter";
    CharType["CJK_CHAR"] = "cjk-char";
    // periods, commas, secondary commas, colons, semicolons, exclamation marks, question marks, etc.
    CharType["HALFWIDTH_PAUSE_OR_STOP"] = "halfwidth-pause-or-stop";
    CharType["FULLWIDTH_PAUSE_OR_STOP"] = "fullwidth-pause-or-stop";
    // single, double, corner, white corner
    // + book title marks
    // left x right
    CharType["HALFWIDTH_QUOTATION"] = "halfwidth-quotation";
    CharType["FULLWIDTH_QUOTATION"] = "fullwidth-quotation";
    // parentheses
    CharType["HALFWIDTH_BRACKET"] = "halfwidth-bracket";
    CharType["FULLWIDTH_BRACKET"] = "fullwidth-bracket";
    // // parenthesis, black lenticular brackets, white lenticular brackets,
    // // square brackets, tortoise shell brackets, curly brackets
    // // left x right
    // PARENTHESIS = 'parenthesis',
    // // double angle brackets, angle brackets
    // // left x right
    // BOOK_TITLE_MARK = 'book-title',
    // dashes, ellipsis, connector marks, interpuncts, proper noun marks, solidi, etc.
    CharType["HALFWIDTH_OTHER_PUNCTUATION"] = "halfwidth-other-punctuation";
    CharType["FULLWIDTH_OTHER_PUNCTUATION"] = "fullwidth-other-punctuation";
    // // ⁈, ⁇, ‼, ⁉
    // SPECIAL_PUNCTUATION_MARK = 'special-punctuation',
    CharType["UNKNOWN"] = "unknown";
})(CharType || (CharType = {}));
export const BRACKET_CHAR_SET = {
    left: '([{（〔［｛',
    right: ')]}）〕］｝'
};
export const QUOTATION_CHAR_SET = {
    left: `“‘《〈『「【〖`,
    right: `”’》〉』」】〗`,
    neutral: `'"`
};
export const SHORTHAND_CHARS = `'’`;
export const SHORTHAND_PAIR_SET = {
    [`'`]: `'`,
    [`’`]: `‘`
};
const FULLWIDTH_PAIRS = `“”‘’（）〔〕［］｛｝《》〈〉「」『』【】〖〗`;
export const isFullwidthPair = (str) => FULLWIDTH_PAIRS.indexOf(str) >= 0;
// Mark
/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
export var MarkType;
(function (MarkType) {
    /**
     * Brackets
     */
    MarkType["BRACKETS"] = "brackets";
    /**
     * Inline Markdown marks
     */
    MarkType["HYPER"] = "hyper";
    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     * - Hexo/VuePress container
     * - Other html code
     */
    MarkType["RAW"] = "raw";
})(MarkType || (MarkType = {}));
export var MarkSideType;
(function (MarkSideType) {
    MarkSideType["LEFT"] = "left";
    MarkSideType["RIGHT"] = "right";
})(MarkSideType || (MarkSideType = {}));
export const isRawMark = (mark) => {
    return mark.code !== undefined;
};
/**
 * TODO: paired html tags should be hyper mark
 */
export var HyperTokenType;
(function (HyperTokenType) {
    /**
     * Brackets
     */
    HyperTokenType["BRACKET_MARK"] = "bracket-mark";
    /**
     * Inline Markdown marks
     */
    HyperTokenType["HYPER_MARK"] = "hyper-mark";
    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     */
    HyperTokenType["CODE_CONTENT"] = "code-content";
    /**
     * - Hexo/VuePress container
     * - Other html code
     */
    HyperTokenType["HYPER_CONTENT"] = "hyper-content";
    /**
     * Unpaired brackets/quotations
     */
    HyperTokenType["UNMATCHED"] = "unmatched";
    /**
     * For indeterminate tokens
     */
    HyperTokenType["INDETERMINATED"] = "indeterminated";
})(HyperTokenType || (HyperTokenType = {}));
export var GroupTokenType;
(function (GroupTokenType) {
    GroupTokenType["GROUP"] = "group";
})(GroupTokenType || (GroupTokenType = {}));
export const getHalfwidthTokenType = (type) => {
    switch (type) {
        case CharType.CJK_CHAR:
            return CharType.WESTERN_LETTER;
        case CharType.FULLWIDTH_PAUSE_OR_STOP:
            return CharType.HALFWIDTH_PAUSE_OR_STOP;
        case CharType.FULLWIDTH_OTHER_PUNCTUATION:
            return CharType.HALFWIDTH_OTHER_PUNCTUATION;
    }
    return type;
};
export const getFullwidthTokenType = (type) => {
    switch (type) {
        case CharType.WESTERN_LETTER:
            return CharType.CJK_CHAR;
        case CharType.HALFWIDTH_PAUSE_OR_STOP:
            return CharType.FULLWIDTH_PAUSE_OR_STOP;
        case CharType.HALFWIDTH_OTHER_PUNCTUATION:
            return CharType.FULLWIDTH_OTHER_PUNCTUATION;
    }
    return type;
};
export const isLetterType = (type) => {
    return type === CharType.WESTERN_LETTER || type === CharType.CJK_CHAR;
};
export const isPauseOrStopType = (type) => {
    return (type === CharType.HALFWIDTH_PAUSE_OR_STOP ||
        type === CharType.FULLWIDTH_PAUSE_OR_STOP);
};
export const isQuotationType = (type) => {
    return (type === CharType.HALFWIDTH_QUOTATION ||
        type === CharType.FULLWIDTH_QUOTATION);
};
export const isBracketType = (type) => {
    return (type === CharType.HALFWIDTH_BRACKET || type === CharType.FULLWIDTH_BRACKET);
};
export const isOtherPunctuationType = (type) => {
    return (type === CharType.HALFWIDTH_OTHER_PUNCTUATION ||
        type === CharType.FULLWIDTH_OTHER_PUNCTUATION);
};
export const isSinglePunctuationType = (type) => {
    return isPauseOrStopType(type) || isOtherPunctuationType(type);
};
export const isPunctuationType = (type) => {
    return (isPauseOrStopType(type) ||
        isQuotationType(type) ||
        isBracketType(type) ||
        isOtherPunctuationType(type));
};
export const isHalfwidthPunctuationType = (type) => {
    return (type === CharType.HALFWIDTH_PAUSE_OR_STOP ||
        type === CharType.HALFWIDTH_QUOTATION ||
        type === CharType.HALFWIDTH_BRACKET ||
        type === CharType.HALFWIDTH_OTHER_PUNCTUATION);
};
export const isHalfwidthType = (type) => {
    return type === CharType.WESTERN_LETTER || isHalfwidthPunctuationType(type);
};
export const isFullwidthPunctuationType = (type) => {
    return (type === CharType.FULLWIDTH_PAUSE_OR_STOP ||
        type === CharType.FULLWIDTH_QUOTATION ||
        type === CharType.FULLWIDTH_BRACKET ||
        type === CharType.FULLWIDTH_OTHER_PUNCTUATION);
};
export const isFullwidthType = (type) => {
    return type === CharType.CJK_CHAR || isFullwidthPunctuationType(type);
};
export const isNonCodeVisibleType = (type) => {
    return (isLetterType(type) ||
        isSinglePunctuationType(type) ||
        type === HyperTokenType.BRACKET_MARK ||
        type === GroupTokenType.GROUP);
};
export const isVisibleType = (type) => {
    return isNonCodeVisibleType(type) || type === HyperTokenType.CODE_CONTENT;
};
export const isInvisibleType = (type) => {
    // OTHERS?
    return type === HyperTokenType.HYPER_MARK;
};
export const isVisibilityUnknownType = (type) => {
    return type === HyperTokenType.HYPER_CONTENT;
};
