/**
 * @fileoverview
 *
 * This rule is resetting all the validations in sentences which are full of
 * western letters and punctuations.
 *
 * Options
 * - skipPureWestern: boolean | undefined
 */
import { GroupTokenType, isFullwidthType } from '../parser/index.js';
const findNonWestern = (group) => {
    return group.some((token) => {
        if (token.type === GroupTokenType.GROUP) {
            return findNonWestern(token);
        }
        if (isFullwidthType(token.type)) {
            if (token.value.match(/[‘’“”]/)) {
                return false;
            }
            return true;
        }
    });
};
const resetValidation = (group) => {
    group.modifiedSpaceAfter = group.spaceAfter;
    group.modifiedInnerSpaceBefore = group.innerSpaceBefore;
    group.modifiedStartValue = group.startValue;
    group.modifiedEndValue = group.endValue;
    group.validations.length = 0;
    group.forEach((token) => {
        token.validations.length = 0;
        token.modifiedSpaceAfter = token.spaceAfter;
        if (token.type === GroupTokenType.GROUP) {
            resetValidation(token);
        }
        else {
            token.modifiedType = token.type;
            token.modifiedValue = token.value;
        }
    });
};
const generateHandler = (options) => {
    const skipPureWestern = options === null || options === void 0 ? void 0 : options.skipPureWestern;
    return (_, index, group) => {
        if (!skipPureWestern) {
            return;
        }
        if (!group.startValue && index === 0) {
            const hasNonWestern = findNonWestern(group);
            if (!hasNonWestern) {
                resetValidation(group);
            }
        }
    };
};
export const defaultConfig = {
    skipPureWestern: true
};
export default generateHandler;
