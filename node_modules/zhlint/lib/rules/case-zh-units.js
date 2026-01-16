/**
 * @fileoverview
 *
 * This rule is used to revert changes of spaceAfter between numbers and
 * Chinese units.
 */
import { CharType, checkCharType } from '../parser/index.js';
import { ValidationTarget } from '../report.js';
import { findWrappersBetween, findNonCodeVisibleTokenAfter, findNonCodeVisibleTokenBefore, removeValidationOnTarget } from './util.js';
const defaultSkippedZhUnits = `年月日天号时分秒`;
const generateHandler = (options) => {
    const skippedZhUnits = (options === null || options === void 0 ? void 0 : options.skipZhUnits) || '';
    const matcherStr = skippedZhUnits
        .split('')
        .filter((x) => checkCharType(x) === CharType.CJK_CHAR)
        .join('');
    const unitMatcher = new RegExp(`^[${matcherStr}]`);
    return (token, _, group) => {
        // make sure the value is a number
        if (token.type === CharType.WESTERN_LETTER && token.value.match(/^\d+$/)) {
            // make sure the value after is a Chinese unit
            const tokenAfter = findNonCodeVisibleTokenAfter(group, token);
            if (Array.isArray(tokenAfter))
                return;
            if (tokenAfter && tokenAfter.value.match(unitMatcher)) {
                // make sure there is no space between originally
                const { spaceHost: spaceHostAfter, tokens: tokenSeqAfter } = findWrappersBetween(group, token, tokenAfter);
                const hasSpaceAfterOriginally = tokenSeqAfter.some((x) => x.spaceAfter);
                if (hasSpaceAfterOriginally) {
                    return;
                }
                // if any token before
                const tokenBefore = findNonCodeVisibleTokenBefore(group, token);
                if (tokenBefore) {
                    // make sure there is no space between originally
                    const { spaceHost: spaceHostBefore, tokens: tokenSeqBefore } = findWrappersBetween(group, tokenBefore, token);
                    const hasSpaceBeforeOriginally = tokenSeqBefore.some((x) => x.spaceAfter);
                    if (hasSpaceBeforeOriginally) {
                        return;
                    }
                    // revert non-space before
                    if (spaceHostBefore) {
                        spaceHostBefore.modifiedSpaceAfter = '';
                        removeValidationOnTarget(spaceHostBefore, ValidationTarget.SPACE_AFTER);
                    }
                }
                // revert non-space after
                if (spaceHostAfter) {
                    spaceHostAfter.modifiedSpaceAfter = '';
                    removeValidationOnTarget(spaceHostAfter, ValidationTarget.SPACE_AFTER);
                }
            }
        }
    };
};
export const defaultConfig = {
    skipZhUnits: defaultSkippedZhUnits
};
export default generateHandler;
