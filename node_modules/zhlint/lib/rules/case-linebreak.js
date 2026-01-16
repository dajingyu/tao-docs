/**
 * @fileoverview
 *
 * This rule is used to revert changes of spaceAfter with linebreaks.
 * And it's compulsory.
 */
import { ValidationTarget } from '../report.js';
import { removeValidationOnTarget } from './util.js';
const generateHandler = (options) => {
    // do nothing
    options;
    return (token) => {
        if (token.spaceAfter && token.spaceAfter.match(/\n/)) {
            removeValidationOnTarget(token, ValidationTarget.SPACE_AFTER);
            token.modifiedSpaceAfter = token.spaceAfter;
        }
    };
};
export const defaultConfig = {};
export default generateHandler;
