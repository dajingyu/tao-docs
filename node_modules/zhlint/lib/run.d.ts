import type { ParsedBlock, ParserIgnoredCase } from './hypers/types.js';
import type { Validation } from './report.js';
import type { Options } from './options.js';
import type { Config } from './rc/index.js';
import type { IgnoredCase } from './ignore.js';
import type { Piece } from './replace-block.js';
import { MutableToken } from './parser/index.js';
export type { Options } from './options.js';
export type DebugInfo = {
    pieces: Piece[];
    blocks: ParsedBlock[];
    ignoredCases: IgnoredCase[];
    ignoredByParsers: ParserIgnoredCase[];
    ignoredTokens: MutableToken[];
    parserErrors: Validation[];
    ruleErrors: Validation[];
    ignoredRuleErrors: Validation[];
};
export type Result = {
    file?: string;
    disabled?: boolean;
    origin: string;
    result: string;
    validations: Validation[];
    __debug__?: DebugInfo;
};
export declare const run: (str: string, options?: Options) => Result;
export declare const runWithConfig: (str: string, config: Config) => Result;
export default run;
//# sourceMappingURL=run.d.ts.map