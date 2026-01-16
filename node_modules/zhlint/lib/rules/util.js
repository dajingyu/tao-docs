import { ValidationTarget } from '../report.js';
import { MarkSideType, HyperTokenType, isNonCodeVisibleType, isInvisibleType, isVisibleType, CharType, isHalfwidthPunctuationType } from '../parser/index.js';
// find tokens
/**
 * Find the previous token if exists
 */
export const findTokenBefore = (group, token) => {
    if (!token) {
        return;
    }
    const index = group.indexOf(token);
    if (index < 0) {
        return;
    }
    return group[index - 1];
};
/**
 * Find the next token if exists
 */
export const findTokenAfter = (group, token) => {
    if (!token) {
        return;
    }
    const index = group.indexOf(token);
    if (index < 0) {
        return;
    }
    return group[index + 1];
};
/**
 * Find a certain token before, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export const findNonCodeVisibleTokenBefore = (group, token) => {
    if (!token) {
        return;
    }
    const beforeToken = findTokenBefore(group, token);
    if (!beforeToken) {
        return;
    }
    // hyper mark, html pairs: skip
    if (isInvisibleType(beforeToken.type) || getHtmlTagSide(beforeToken)) {
        return findNonCodeVisibleTokenBefore(group, beforeToken);
    }
    // content, punctuation, bracket, group: return token
    if (isNonCodeVisibleType(beforeToken.type)) {
        return beforeToken;
    }
    // code, unknown, container: return undefined
    return;
};
/**
 * Find a certain token after, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export const findNonCodeVisibleTokenAfter = (group, token) => {
    if (!token) {
        return;
    }
    const afterToken = findTokenAfter(group, token);
    if (!afterToken) {
        return;
    }
    // hyper mark, html pairs: skip
    if (isInvisibleType(afterToken.type) || getHtmlTagSide(afterToken)) {
        return findNonCodeVisibleTokenAfter(group, afterToken);
    }
    // content, punctuation, bracket, group: return token
    if (isNonCodeVisibleType(afterToken.type)) {
        return afterToken;
    }
    // code, unknown, container: return undefined
    return;
};
/**
 * Find a certain token before, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export const findVisibleTokenBefore = (group, token) => {
    if (!token) {
        return;
    }
    const beforeToken = findTokenBefore(group, token);
    if (!beforeToken) {
        return;
    }
    // hyper mark, html pairs: skip
    if (isInvisibleType(beforeToken.type) || getHtmlTagSide(beforeToken)) {
        return findVisibleTokenBefore(group, beforeToken);
    }
    // content, punctuation, bracket, group, code: return token
    if (isVisibleType(beforeToken.type)) {
        return beforeToken;
    }
    // unknown, container: return undefined
    return;
};
/**
 * Find a certain token after, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark, html pairs will be skipped
 */
export const findVisibleTokenAfter = (group, token) => {
    if (!token) {
        return;
    }
    const afterToken = findTokenAfter(group, token);
    if (!afterToken) {
        return;
    }
    // hyper mark, html pairs: skip
    if (isInvisibleType(afterToken.type) || getHtmlTagSide(afterToken)) {
        return findVisibleTokenAfter(group, afterToken);
    }
    // content, punctuation, bracket, group, code: return token
    if (isVisibleType(afterToken.type)) {
        return afterToken;
    }
    // unknown, container: return undefined
    return;
};
// hyper mark seq
const isHtmlTag = (token) => {
    if (token.type !== HyperTokenType.HYPER_CONTENT) {
        return false;
    }
    return !!token.value.match(/^<.+>$/);
};
const getHtmlTagSide = (token) => {
    if (!isHtmlTag(token)) {
        return;
    }
    if (token.value.match(/^<code.*>.*<\/code.*>$/)) {
        return;
    }
    if (token.value.match(/^<[^/].+\/\s*>$/)) {
        return;
    }
    if (token.value.match(/^<[^/].+>$/)) {
        return MarkSideType.LEFT;
    }
    if (token.value.match(/^<\/.+>$/)) {
        return MarkSideType.RIGHT;
    }
};
export const isWrapper = (token) => {
    return token.type === HyperTokenType.HYPER_MARK || !!getHtmlTagSide(token);
};
export const getWrapperSide = (token) => {
    if (token.type === HyperTokenType.HYPER_MARK) {
        return token.markSide;
    }
    return getHtmlTagSide(token);
};
const spreadHyperMarkSeq = (group, token, seq, isBackward) => {
    if (isBackward) {
        const tokenBefore = findTokenBefore(group, token);
        if (tokenBefore && isWrapper(tokenBefore)) {
            seq.unshift(tokenBefore);
            spreadHyperMarkSeq(group, tokenBefore, seq, isBackward);
        }
    }
    else {
        const tokenAfter = findTokenAfter(group, token);
        if (tokenAfter && isWrapper(tokenAfter)) {
            seq.push(tokenAfter);
            spreadHyperMarkSeq(group, tokenAfter, seq, isBackward);
        }
    }
};
export const findConnectedWrappers = (group, token) => {
    const seq = [token];
    spreadHyperMarkSeq(group, token, seq, false);
    spreadHyperMarkSeq(group, token, seq, true);
    return seq;
};
const findSpaceHostInHyperMarkSeq = (group, hyperMarkSeq) => {
    // Return nothing if the seq is empty
    if (!hyperMarkSeq.length) {
        return;
    }
    const firstMark = hyperMarkSeq[0];
    const lastMark = hyperMarkSeq[hyperMarkSeq.length - 1];
    const firstMarkSide = getWrapperSide(firstMark);
    const lastMarkSide = getWrapperSide(lastMark);
    const tokenBefore = findTokenBefore(group, firstMark);
    if (!tokenBefore) {
        return;
    }
    // Return nothing if any token is not a mark.
    if (!firstMarkSide || !lastMarkSide) {
        return;
    }
    // If first and last mark have the same side, then return:
    // - token before first mark if they are the left side
    // - last mark if they are the right side
    if (firstMarkSide === lastMarkSide) {
        if (firstMarkSide === MarkSideType.LEFT) {
            return tokenBefore;
        }
        return lastMark;
    }
    // If first mark is the left side and last mark is the right side,
    // that usually means multiple marks partially overlapped.
    // This situation is abnormal but technically exists.
    // We'd better do nothing and leave this issue to human.
    if (firstMarkSide === MarkSideType.LEFT) {
        return;
    }
    // If first mark is the right side and last mark is the left side,
    // that usually means multiple marks closely near eath other.
    // We'd better find the gap outside the both sides of marks.
    let target = tokenBefore;
    while (target && target !== lastMark) {
        const nextToken = findTokenAfter(group, target);
        if (nextToken && getWrapperSide(nextToken) === MarkSideType.LEFT) {
            return target;
        }
        target = nextToken;
    }
    return tokenBefore;
};
export const findWrappersBetween = (group, before, after) => {
    if (!before || !after) {
        return {
            spaceHost: undefined,
            wrappers: [],
            tokens: []
        };
    }
    const firstMark = findTokenAfter(group, before);
    const firstVisible = findVisibleTokenAfter(group, before);
    if (!firstMark || firstVisible !== after) {
        return {
            spaceHost: undefined,
            wrappers: [],
            tokens: []
        };
    }
    if (firstMark === after) {
        return {
            spaceHost: before,
            wrappers: [],
            tokens: [before]
        };
    }
    const markSeq = findConnectedWrappers(group, firstMark);
    const spaceHost = findSpaceHostInHyperMarkSeq(group, markSeq);
    return {
        spaceHost,
        wrappers: markSeq,
        tokens: [before, ...markSeq]
    };
};
// special cases
export const isHalfwidthPunctuationWithoutSpaceAround = (group, token) => {
    const tokenBefore = findTokenBefore(group, token);
    const tokenAfter = findTokenAfter(group, token);
    if (isHalfwidthPunctuationType(token.type) &&
        tokenBefore &&
        tokenBefore.type === CharType.WESTERN_LETTER &&
        tokenAfter &&
        tokenAfter.type === CharType.WESTERN_LETTER) {
        return !tokenBefore.spaceAfter && !token.spaceAfter;
    }
    return false;
};
export const isSuccessiveHalfwidthPunctuation = (group, token) => {
    if (isHalfwidthPunctuationType(token.type)) {
        const tokenBefore = findTokenBefore(group, token);
        const tokenAfter = findTokenAfter(group, token);
        if ((tokenBefore &&
            isHalfwidthPunctuationType(tokenBefore.type) &&
            !tokenBefore.spaceAfter) ||
            (tokenAfter &&
                isHalfwidthPunctuationType(tokenAfter.type) &&
                !token.spaceAfter)) {
            return true;
        }
    }
    return false;
};
// validations helpers
const createValidation = (token, target, message, name) => {
    const validation = {
        index: token.index,
        length: token.length,
        target,
        name,
        message
    };
    if (target === ValidationTarget.START_VALUE) {
        validation.index = token.startIndex;
        validation.length = 0;
    }
    else if (target === ValidationTarget.END_VALUE) {
        validation.index = token.endIndex;
        validation.length = 0;
    }
    else if (target === ValidationTarget.INNER_SPACE_BEFORE) {
        validation.index = token.startIndex;
        validation.length = token.startValue.length;
    }
    return validation;
};
export const setValidationOnTarget = (token, target, message, name) => {
    const validation = createValidation(token, target, message, name);
    removeValidationOnTarget(token, target);
    token.validations.push(validation);
};
export const hasValidationOnTarget = (token, target) => {
    return token.validations.some((validation) => validation.target === target);
};
export const removeValidationOnTarget = (token, target) => {
    token.validations = token.validations.filter((validation) => validation.target !== target);
};
const genChecker = (key, target) => {
    return (token, value, message) => {
        if (token[key] !== value) {
            token[key] = value;
            setValidationOnTarget(token, target, message, '');
        }
    };
};
export const checkSpaceAfter = genChecker('modifiedSpaceAfter', ValidationTarget.SPACE_AFTER);
export const checkStartValue = genChecker('modifiedStartValue', ValidationTarget.START_VALUE);
export const checkEndValue = genChecker('modifiedEndValue', ValidationTarget.END_VALUE);
export const checkInnerSpaceBefore = genChecker('modifiedInnerSpaceBefore', ValidationTarget.INNER_SPACE_BEFORE);
export const checkValue = (token, value, type, message) => {
    if (token.modifiedValue === value) {
        return;
    }
    token.modifiedValue = value;
    if (type) {
        token.modifiedType = type;
    }
    setValidationOnTarget(token, ValidationTarget.VALUE, message, '');
};
