/// <reference types="node" resolution-mode="require"/>
import { ParsedStatus } from './hypers/types.js';
import { IgnoredCase } from './ignore.js';
import { Options as RuleOptions } from './rules/util.js';
export type Options = {
    logger?: Console;
    rules?: RuleOptions;
    hyperParse?: (string | ((status: ParsedStatus) => ParsedStatus))[] | ((status: ParsedStatus) => ParsedStatus);
    ignoredCases?: IgnoredCase[];
};
export type NormalizedOptions = {
    logger: Console;
    rules: RuleOptions;
    hyperParse: Array<(status: ParsedStatus) => ParsedStatus>;
    ignoredCases: IgnoredCase[];
};
import { Config } from './rc/index.js';
export declare const normalizeOptions: (options: Options) => NormalizedOptions;
export declare const normalizeConfig: (config: Config, logger?: Console) => NormalizedOptions;
//# sourceMappingURL=options.d.ts.map