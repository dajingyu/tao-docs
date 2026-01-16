/// <reference types="node" resolution-mode="require"/>
import { Options } from '../options.js';
export type Config = {
    preset?: string;
    rules?: Options['rules'];
    hyperParsers?: string[];
    fileIgnores?: string[];
    caseIgnores?: string[];
};
export declare const readRc: (dir: string, config: string, fileIgnore: string, caseIgnore: string, logger?: Console) => Config;
//# sourceMappingURL=index.d.ts.map