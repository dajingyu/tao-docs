/// <reference types="node" resolution-mode="require"/>
export type IgnoredCase = {
    prefix?: string;
    textStart: string;
    textEnd?: string;
    suffix?: string;
};
export type IgnoredMark = {
    start: number;
    end: number;
};
/**
 * @param  {string}        str
 * @param  {IgnoredCase[]} ignoredCases string which should be skipped
 * @return {IgnoredMark[]}
 */
declare const findIgnoredMarks: (str: string, ignoredCases?: IgnoredCase[], logger?: Console) => IgnoredMark[];
export default findIgnoredMarks;
//# sourceMappingURL=ignore.d.ts.map