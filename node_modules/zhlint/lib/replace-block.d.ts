import type { ParsedBlock } from './hypers/types.js';
export type Piece = ParsedBlock | NonBlock;
export type NonBlock = {
    nonBlock: true;
    start: number;
    end: number;
    value: string;
};
export declare const isBlock: (piece: Piece) => piece is ParsedBlock;
declare const replaceBlocks: (str: string, blocks: ParsedBlock[]) => {
    value: string;
    pieces: Piece[];
};
export default replaceBlocks;
//# sourceMappingURL=replace-block.d.ts.map