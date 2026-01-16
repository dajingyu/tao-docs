import { ParsedStatus } from './types.js';
/**
  - travel all blocks/lists/tables/rows/cells
    - content: paragraph/heading/table-cell
    - no content: thematic break/code/html
  - for all phrasings:
    - no text: inline code/break/image/image ref/footnote ref/html
    - marks: emphasis/strong/delete/footnote/link/link ref
 */
declare const parser: (data: ParsedStatus) => ParsedStatus;
export default parser;
//# sourceMappingURL=md.d.ts.map