import { Mark, MarkMap, MarkSideType, MarkType, LetterType, SingleToken, HyperTokenType, Token, PunctuationType } from './types.js';
import { ParseStatus } from './parse.js';
export declare const handlePunctuation: (i: number, char: string, type: PunctuationType, status: ParseStatus) => void;
export declare const handleLetter: (i: number, char: string, type: LetterType, status: ParseStatus) => void;
export declare const initNewStatus: (str: string, hyperMarks: Mark[]) => ParseStatus;
export declare const finalizeLastToken: (status: ParseStatus, index: number) => void;
export declare const finalizeCurrentToken: (status: ParseStatus, token: SingleToken) => void;
export declare const addHyperToken: (status: ParseStatus, index: number, mark: Mark, value: string, markSide: MarkSideType) => void;
export declare const addRawContent: (status: ParseStatus, index: number, value: string) => void;
export declare const initNewMark: (status: ParseStatus, index: number, char: string, type?: MarkType) => void;
export declare const addBracketToken: (status: ParseStatus, index: number, char: string, markSide: MarkSideType) => void;
export declare const finalizeCurrentMark: (status: ParseStatus, index: number, char: string) => void;
export declare const initNewGroup: (status: ParseStatus, index: number, char: string) => void;
export declare const finalizeCurrentGroup: (status: ParseStatus, index: number, char: string) => void;
export declare const initNewContent: (status: ParseStatus, index: number, char: string, type: LetterType) => void;
export declare const appendValue: (status: ParseStatus, char: string) => void;
/**
 * Get the length of connecting spaces from a certain index
 */
export declare const getConnectingSpaceLength: (str: string, start: number) => number;
export declare const getPreviousToken: (status: ParseStatus) => Token | undefined;
export declare const getHyperMarkMap: (hyperMarks: Mark[]) => MarkMap;
export declare const isShorthand: (str: string, status: ParseStatus, index: number, char: string) => boolean;
export declare const getHyperContentType: (content: string) => HyperTokenType;
export declare const handleErrors: (status: ParseStatus) => void;
//# sourceMappingURL=util.d.ts.map