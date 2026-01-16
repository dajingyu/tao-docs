import { ValidationTarget } from './report.js';
const isInRange = (start, end, mark) => {
    return start <= mark.end && end >= mark.start;
};
const isIgnored = (token, marks = []) => {
    const result = {
        ignored: false,
        [ValidationTarget.VALUE]: false,
        [ValidationTarget.SPACE_AFTER]: false,
        [ValidationTarget.START_VALUE]: false,
        [ValidationTarget.END_VALUE]: false,
        [ValidationTarget.INNER_SPACE_BEFORE]: false
    };
    // - group: startValue, innerSpaceBefore, endValue, spaceAfter
    // - single: raw, spaceAfter
    marks.forEach((mark) => {
        if (Array.isArray(token)) {
            const { index, startValue, innerSpaceBefore, endIndex = 0, endValue, spaceAfter } = token;
            if (isInRange(index, index + (startValue || '').length, mark)) {
                result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
            }
            if (isInRange(index + (startValue || '').length, index + (startValue || '').length + (innerSpaceBefore || '').length, mark)) {
                result[ValidationTarget.INNER_SPACE_BEFORE] = result.ignored = true;
            }
            if (isInRange(endIndex, endIndex + (endValue || '').length, mark)) {
                result[ValidationTarget.END_VALUE] = result.ignored = true;
            }
            if (isInRange(endIndex + (endValue || '').length, endIndex + (endValue || '').length + (spaceAfter || '').length, mark)) {
                result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
            }
        }
        else {
            const { index, value: value, spaceAfter } = token;
            if (isInRange(index, index + (value || '').length, mark)) {
                result[ValidationTarget.VALUE] = result.ignored = true;
            }
            if (isInRange(index + (value || '').length, index + (value || '').length + (spaceAfter || '').length, mark)) {
                result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
            }
        }
    });
    return result;
};
const recordValidations = (token, offset = 0, ignoredFlags, validations = [], ignoredValidations = []) => {
    token.validations.forEach((v) => {
        const validationWithOffset = Object.assign(Object.assign({}, v), { index: v.index + offset });
        if (!ignoredFlags[v.target]) {
            validations.push(validationWithOffset);
        }
        else {
            ignoredValidations.push(validationWithOffset);
        }
    });
};
/**
 * Join tokens back into string
 * @param tokens the target group token, the index is relative to the block it belongs to
 * @param offset the index of the block, relative to the file it belongs to
 * @param ignoredMarks the ignored marks, the index is relative to the block it belongs to
 * @param validations the validation list result
 * @param isChild whether the group token is a child token of the block
 */
const join = (tokens, offset = 0, ignoredMarks = [], ignoredTokens = [], validations = [], ignoredValidations = [], isChild) => {
    const ignoredFlags = isIgnored(tokens, ignoredMarks);
    if (!isChild && ignoredFlags.ignored) {
        ignoredTokens.push(tokens);
    }
    if (!isChild) {
        recordValidations(tokens, offset, ignoredFlags, validations, ignoredValidations);
    }
    if (ignoredFlags[ValidationTarget.START_VALUE]) {
        tokens.ignoredStartValue = tokens.modifiedStartValue;
        tokens.modifiedStartValue = tokens.startValue;
    }
    if (ignoredFlags[ValidationTarget.INNER_SPACE_BEFORE]) {
        tokens.ignoredInnerSpaceBefore = tokens.modifiedInnerSpaceBefore;
        tokens.modifiedInnerSpaceBefore = tokens.innerSpaceBefore;
    }
    if (ignoredFlags[ValidationTarget.END_VALUE]) {
        tokens.ignoredEndValue = tokens.modifiedEndValue;
        tokens.modifiedEndValue = tokens.endValue;
    }
    if (ignoredFlags[ValidationTarget.SPACE_AFTER]) {
        tokens.ignoredSpaceAfter = tokens.modifiedSpaceAfter;
        tokens.modifiedSpaceAfter = tokens.spaceAfter;
    }
    return [
        tokens.modifiedStartValue,
        tokens.modifiedInnerSpaceBefore,
        ...tokens.map((token) => {
            const subIgnoredFlags = isIgnored(token, ignoredMarks);
            if (subIgnoredFlags.ignored) {
                ignoredTokens.push(token);
            }
            recordValidations(token, offset, subIgnoredFlags, validations, ignoredValidations);
            if (!Array.isArray(token)) {
                if (subIgnoredFlags[ValidationTarget.VALUE]) {
                    token.ignoredValue = token.modifiedValue;
                    token.modifiedValue = token.value;
                }
                if (subIgnoredFlags[ValidationTarget.SPACE_AFTER]) {
                    token.ignoredSpaceAfter = token.modifiedSpaceAfter;
                    token.modifiedSpaceAfter = token.spaceAfter;
                }
                return [token.modifiedValue, token.modifiedSpaceAfter]
                    .filter(Boolean)
                    .join('');
            }
            return join(token, offset, ignoredMarks, ignoredTokens, validations, ignoredValidations, true);
        }),
        tokens.modifiedEndValue,
        tokens.modifiedSpaceAfter
    ]
        .filter(Boolean)
        .join('');
};
export default join;
