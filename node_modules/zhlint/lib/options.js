import ignore, { parseIngoredCase } from './hypers/ignore.js';
import hexo from './hypers/hexo.js';
import vuepress from './hypers/vuepress.js';
import md from './hypers/md.js';
import { defaultConfig as defaultRules } from './rules/index.js';
import { env } from './report.js';
const hyperParseInfo = [
    { name: 'ignore', value: ignore },
    { name: 'hexo', value: hexo },
    { name: 'vuepress', value: vuepress },
    { name: 'markdown', value: md }
];
const arrToMap = (arr) => arr.reduce((current, { name, value }) => {
    current[name] = value;
    return current;
}, {});
const hyperParseMap = arrToMap(hyperParseInfo);
const matchCallArray = (calls, map) => calls
    .map((call) => {
    switch (typeof call) {
        case 'function':
            return call;
        case 'string':
            return map[call];
        default:
            return null;
    }
})
    .filter(Boolean);
const DEPRECATED_OPTIONS = {
    halfWidthPunctuation: 'halfwidthPunctuation',
    fullWidthPunctuation: 'fullwidthPunctuation',
    adjustedFullWidthPunctuation: 'adjustedFullwidthPunctuation',
    spaceBetweenHalfWidthLetters: 'spaceBetweenHalfwidthContent',
    spaceBetweenHalfWidthContent: 'spaceBetweenHalfwidthContent',
    noSpaceBetweenFullWidthLetters: 'noSpaceBetweenFullwidthContent',
    noSpaceBetweenFullWidthContent: 'noSpaceBetweenFullwidthContent',
    spaceBetweenMixedWidthLetters: 'spaceBetweenMixedwidthContent',
    spaceBetweenMixedWidthContent: 'spaceBetweenMixedwidthContent',
    noSpaceBeforePunctuation: 'noSpaceBeforePauseOrStop',
    spaceAfterHalfWidthPunctuation: 'spaceAfterHalfwidthPauseOrStop',
    noSpaceAfterFullWidthPunctuation: 'noSpaceAfterFullwidthPauseOrStop',
    spaceOutsideHalfQuote: 'spaceOutsideHalfwidthQuotation',
    noSpaceOutsideFullQuote: 'noSpaceOutsideFullwidthQuotation',
    noSpaceInsideQuote: 'noSpaceInsideQuotation',
    spaceOutsideHalfBracket: 'spaceOutsideHalfwidthBracket',
    noSpaceOutsideFullBracket: 'noSpaceOutsideFullwidthBracket',
    noSpaceInsideWrapper: 'noSpaceInsideHyperMark',
    noSpaceInsideMark: 'noSpaceInsideHyperMark'
};
const deprecateOptions = (ruleOption, logger) => {
    var _a;
    for (const oldKey in DEPRECATED_OPTIONS) {
        const newKey = DEPRECATED_OPTIONS[oldKey];
        if (ruleOption[oldKey]) {
            logger.warn(`[deprecate] ${oldKey} is deprecated, use ${newKey} instead`);
            ruleOption[newKey] = (_a = ruleOption[newKey]) !== null && _a !== void 0 ? _a : ruleOption[oldKey];
            delete ruleOption[oldKey];
        }
    }
};
export const normalizeOptions = (options) => {
    var _a, _b;
    const logger = (_a = options.logger) !== null && _a !== void 0 ? _a : env.defaultLogger;
    const rules = (_b = options.rules) !== null && _b !== void 0 ? _b : {};
    const preset = rules.preset === 'default' ? defaultRules : {};
    deprecateOptions(rules, logger);
    let hyperParse;
    if (typeof options.hyperParse === 'function') {
        hyperParse = [options.hyperParse];
    }
    else {
        hyperParse = options.hyperParse || hyperParseInfo.map((item) => item.name);
    }
    const normoalizedOptions = {
        logger,
        ignoredCases: options.ignoredCases || [],
        rules: Object.assign(Object.assign({}, preset), rules),
        hyperParse: matchCallArray(hyperParse, hyperParseMap)
    };
    return normoalizedOptions;
};
export const normalizeConfig = (config, logger = env.defaultLogger) => {
    const options = {
        logger,
        rules: {},
        hyperParse: [],
        ignoredCases: []
    };
    let hyperParse = [];
    // preset
    if (config.preset === 'default') {
        options.rules = Object.assign({}, defaultRules);
        hyperParse = hyperParseInfo.map((item) => item.name);
    }
    // rules
    if (config.rules) {
        options.rules = Object.assign(Object.assign({}, options.rules), config.rules);
    }
    // hyper parsers
    if (Array.isArray(config.hyperParsers)) {
        hyperParse = config.hyperParsers;
    }
    hyperParse.forEach((x) => {
        if (!hyperParseMap[x]) {
            logger.log(`The hyper parser ${x} is invalid.`);
            return;
        }
        options.hyperParse.push(hyperParseMap[x]);
    });
    // ignored cases
    if (config.caseIgnores) {
        config.caseIgnores.forEach((x) => {
            const ignoredCase = parseIngoredCase(x);
            if (ignoredCase) {
                options.ignoredCases.push(ignoredCase);
            }
            else {
                logger.log(`The format of ignore case: "${x}" is invalid.`);
            }
        });
    }
    return options;
};
