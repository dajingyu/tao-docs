import { resolve } from 'path';
import fs from 'fs';
import { env } from '../report.js';
// to walk around https://github.com/davidmyersdev/vite-plugin-node-polyfills/issues/82
const { existsSync, readFileSync } = fs || {};
const DEFAULT_CONFIG_PATH = '.zhlintrc';
const DEFAULT_FILE_IGNORE_PATH = '.zhlintignore';
const DEFAULT_CASE_IGNORE_PATH = '.zhlintcaseignore';
const resolvePath = (dir, config, fileIgnore, caseIgnore, logger = env.defaultLogger) => {
    const result = {
        config: undefined,
        fileIgnore: undefined,
        caseIgnore: undefined
    };
    dir = resolve(dir !== null && dir !== void 0 ? dir : '.');
    if (!existsSync(dir)) {
        logger.log(`"${dir}" does not exist.`);
        return result;
    }
    config = resolve(dir, config !== null && config !== void 0 ? config : DEFAULT_CONFIG_PATH);
    if (existsSync(config)) {
        result.config = config;
    }
    else {
        logger.log(`Config file "${config}" does not exist. Will proceed as default.`);
    }
    fileIgnore = resolve(dir, fileIgnore !== null && fileIgnore !== void 0 ? fileIgnore : DEFAULT_FILE_IGNORE_PATH);
    if (existsSync(fileIgnore)) {
        result.fileIgnore = fileIgnore;
    }
    else {
        logger.log(`Global ignored cases file "${fileIgnore}" does not exist. Will proceed as none.`);
    }
    caseIgnore = resolve(dir, caseIgnore !== null && caseIgnore !== void 0 ? caseIgnore : DEFAULT_CASE_IGNORE_PATH);
    if (existsSync(caseIgnore)) {
        result.caseIgnore = caseIgnore;
    }
    else {
        logger.log(`Global ignored cases file "${caseIgnore}" does not exist. Will proceed as none.`);
    }
    return result;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJSONSync = (filepath) => {
    const output = readFileSync(filepath, { encoding: 'utf8' });
    return JSON.parse(output);
};
const resolveConfig = (normalizedConfigPath, normalizedFileIgnorePath, normalizedCaseIgnorePath, logger = env.defaultLogger) => {
    const result = {
        preset: 'default'
    };
    if (normalizedConfigPath) {
        try {
            const config = readJSONSync(normalizedConfigPath);
            if (typeof config.preset === 'string') {
                result.preset = config.preset;
            }
            if (typeof config.rules === 'object') {
                result.rules = config.rules;
            }
            if (Array.isArray(config.hyperParsers)) {
                result.hyperParsers = config.hyperParsers;
            }
            if (Array.isArray(config.fileIgnores)) {
                result.fileIgnores = config.fileIgnores;
            }
            if (Array.isArray(config.caseIgnores)) {
                result.caseIgnores = config.caseIgnores;
            }
        }
        catch (error) {
            logger.log(`Failed to read "${normalizedConfigPath}": ${error.message}`);
        }
    }
    if (normalizedFileIgnorePath) {
        try {
            const fileIgnores = readFileSync(normalizedFileIgnorePath, {
                encoding: 'utf8'
            });
            fileIgnores
                .split(/\n/)
                .map((x) => x.trim())
                .forEach((x) => {
                if (!x) {
                    return;
                }
                if (!result.fileIgnores) {
                    result.fileIgnores = [];
                }
                if (result.fileIgnores.indexOf(x) === -1) {
                    result.fileIgnores.push(x);
                }
            });
        }
        catch (error) {
            logger.log(`Failed to read "${normalizedFileIgnorePath}": ${error.message}`);
        }
    }
    if (normalizedCaseIgnorePath) {
        try {
            const caseIgnores = readFileSync(normalizedCaseIgnorePath, {
                encoding: 'utf8'
            });
            caseIgnores
                .split(/\n/)
                .map((x) => x.trim())
                .forEach((x) => {
                if (!x) {
                    return;
                }
                if (!result.caseIgnores) {
                    result.caseIgnores = [];
                }
                if (result.caseIgnores.indexOf(x) === -1) {
                    result.caseIgnores.push(x);
                }
            });
        }
        catch (error) {
            logger.log(`Failed to read "${normalizedCaseIgnorePath}": ${error.message}`);
        }
    }
    return result;
};
export const readRc = (dir, config, fileIgnore, caseIgnore, logger = env.defaultLogger) => {
    const { config: normalizedConfigPath, fileIgnore: normalizedFileIgnorePath, caseIgnore: normalizedCaseIgnorePath } = resolvePath(dir, config, fileIgnore, caseIgnore, logger);
    return resolveConfig(normalizedConfigPath, normalizedFileIgnorePath, normalizedCaseIgnorePath, logger);
};
