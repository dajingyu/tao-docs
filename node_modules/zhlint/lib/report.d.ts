/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
export declare const env: {
    stdout: NodeJS.WritableStream;
    stderr: NodeJS.WritableStream;
    defaultLogger: Console;
};
export declare enum ValidationTarget {
    VALUE = "value",
    START_VALUE = "startValue",
    END_VALUE = "endValue",
    SPACE_AFTER = "spaceAfter",
    INNER_SPACE_BEFORE = "innerSpaceBefore"
}
export type Validation = {
    name: string;
    message: string;
    index: number;
    length: number;
    target: ValidationTarget;
};
export declare const reportItem: (file: string | undefined, str: string, validations: Validation[], logger?: Console) => void;
export type Result = {
    file?: string;
    disabled: boolean;
    origin: string;
    validations: Validation[];
};
export declare const report: (resultList: Result[], logger?: Console) => 1 | undefined;
//# sourceMappingURL=report.d.ts.map