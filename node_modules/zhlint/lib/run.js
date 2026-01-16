import { normalizeOptions, normalizeConfig } from './options.js';
import { parse, toMutableResult, travel } from './parser/index.js';
import generateHandlers from './rules/index.js';
import findIgnoredMarks from './ignore.js';
import join from './join.js';
import replaceBlocks from './replace-block.js';
export const run = (str, options = {}) => {
    const normalizedOptions = normalizeOptions(options);
    return lint(str, normalizedOptions);
};
export const runWithConfig = (str, config) => {
    const normalizedOptions = normalizeConfig(config);
    return lint(str, normalizedOptions);
};
const lint = (str, normalizedOptions) => {
    // return if the file is totally ignored
    const disabledMatcher = /<!--\s*zhlint\s*disabled\s*-->/g;
    if (str.match(disabledMatcher)) {
        return { origin: str, result: str, validations: [], disabled: true };
    }
    const { logger, ignoredCases, rules, hyperParse } = normalizedOptions;
    // init status
    // str -> ignoredByRules, ignoredByParsers
    // blocks -> marks, ignoredMarks
    const status = {
        value: str,
        modifiedValue: str,
        ignoredByRules: ignoredCases,
        ignoredByParsers: [],
        blocks: [
            {
                value: str,
                marks: [],
                start: 0,
                end: str.length - 1
            }
        ]
    };
    const ignoredTokens = [];
    const parserErrors = [];
    const ruleErrors = [];
    const ignoredRuleErrors = [];
    // Run all the hyper parsers
    const parsedStatus = hyperParse.reduce((current, parse) => parse(current), status);
    // 1. Parse each block without ignoredByParsers
    // 2. Parse all ignoredByRules into marks for each block
    // 3. Run all rule processes for each block
    // 4. Join all tokens with ignoredMarks and all errors for each block
    // 5. Replace each block back to the string
    const ruleHandlers = generateHandlers(rules);
    const modifiedBlocks = parsedStatus.blocks.map(({ value, marks, start, end }) => {
        let lastValue = value;
        if (globalThis.__DEV__) {
            logger.log('[Original block value]');
            logger.log(lastValue);
        }
        const result = toMutableResult(parse(value, marks), rules);
        parserErrors.push(...result.errors);
        const ignoredMarks = findIgnoredMarks(value, status.ignoredByRules, logger);
        ruleHandlers.forEach((rule) => {
            travel(result.tokens, rule);
            if (globalThis.__DEV__) {
                const currentValue = join(result.tokens, start, ignoredMarks, [], [], []);
                if (lastValue !== currentValue) {
                    logger.log(`[After process by ${rule.name}]`);
                    logger.log(currentValue);
                }
                lastValue = currentValue;
            }
        });
        lastValue = join(result.tokens, start, ignoredMarks, ignoredTokens, ruleErrors, ignoredRuleErrors);
        if (globalThis.__DEV__) {
            logger.log('[Eventual block value]');
            logger.log(lastValue + '\n');
        }
        return Object.assign(Object.assign({}, result), { start,
            end, value: lastValue, originValue: value });
    });
    const result = replaceBlocks(str, modifiedBlocks);
    const debugInfo = {
        pieces: result.pieces,
        blocks: modifiedBlocks,
        ignoredCases: parsedStatus.ignoredByRules,
        ignoredByParsers: parsedStatus.ignoredByParsers,
        ignoredTokens,
        parserErrors,
        ruleErrors,
        ignoredRuleErrors
    };
    return {
        origin: str,
        result: result.value,
        validations: [...parserErrors, ...ruleErrors],
        __debug__: debugInfo
    };
};
export default run;
