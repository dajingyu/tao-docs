import { MutableGroupToken, GroupToken, MutableToken, Token } from './types.js';
export type Handler = (token: MutableToken | Token, index: number, group: MutableGroupToken | GroupToken) => void;
export declare const travel: (group: MutableGroupToken | GroupToken, handler: Handler) => void;
//# sourceMappingURL=travel.d.ts.map