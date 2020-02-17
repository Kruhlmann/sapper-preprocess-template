"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const LANG_DICT = new Map([
    ['pcss', 'css'],
    ['postcss', 'css'],
    ['sass', 'scss'],
    ['styl', 'stylus'],
    ['js', 'javascript'],
    ['coffee', 'coffeescript'],
    ['ts', 'typescript'],
]);
const throwError = (msg) => {
    throw new Error(`[svelte-preprocess] ${msg}`);
};
exports.concat = (...arrs) => arrs.reduce((acc, a) => (a ? acc.concat(a) : acc), []);
exports.throwUnsupportedError = (lang, filename) => throwError(`Unsupported script language '${lang}' in file '${filename}'`);
exports.isFn = (maybeFn) => typeof maybeFn === 'function';
exports.resolveSrc = (importerFile, srcPath) => path_1.resolve(path_1.dirname(importerFile), srcPath);
exports.getSrcContent = (file) => {
    return new Promise((resolve, reject) => {
        fs_1.readFile(file, (error, data) => {
            // istanbul ignore if
            if (error)
                reject(error);
            else
                resolve(data.toString());
        });
    });
};
async function doesFileExist(file) {
    return new Promise(resolve => fs_1.access(file, 0, err => resolve(!err)));
}
exports.parseFile = async ({ attributes, filename, content }, language) => {
    const dependencies = [];
    if (attributes.src) {
        // istanbul ignore if
        if (typeof attributes.src !== 'string') {
            throw new Error('src attribute must be string');
        }
        let path = attributes.src;
        /** Only try to get local files (path starts with ./ or ../) */
        if (path.match(/^(https?:)?\/\//) == null) {
            path = exports.resolveSrc(filename, path);
            if (await doesFileExist(path)) {
                content = await exports.getSrcContent(path);
                dependencies.push(path);
            }
        }
    }
    const { lang, alias } = exports.getLanguage(attributes, language);
    return {
        filename,
        attributes,
        content,
        lang,
        alias,
        dependencies,
    };
};
exports.addLanguageAlias = (entries) => entries.forEach(entry => LANG_DICT.set(...entry));
/** Paths used by preprocessors to resolve @imports */
exports.getIncludePaths = (fromFilename, base = []) => [
    ...new Set([...base, 'node_modules', process.cwd(), path_1.dirname(fromFilename)]),
];
exports.getLanguage = (attributes, defaultLang) => {
    let lang = defaultLang;
    if (attributes.lang) {
        // istanbul ignore if
        if (typeof attributes.lang !== 'string') {
            throw new Error('lang attribute must be string');
        }
        lang = attributes.lang;
    }
    else if (attributes.type) {
        // istanbul ignore if
        if (typeof attributes.type !== 'string') {
            throw new Error('type attribute must be string');
        }
        lang = attributes.type.replace(/^(text|application)\/(.*)$/, '$2');
    }
    else if (attributes.src) {
        // istanbul ignore if
        if (typeof attributes.src !== 'string') {
            throw new Error('src attribute must be string');
        }
        const parts = path_1.basename(attributes.src).split('.');
        lang = parts.length > 1 ? parts.pop() : defaultLang;
    }
    return {
        lang: LANG_DICT.get(lang) || lang,
        alias: lang,
    };
};
const TRANSFORMERS = {};
exports.runTransformer = async (name, options, { content, map, filename }) => {
    if (typeof options === 'function') {
        return options({ content, map, filename });
    }
    try {
        if (!TRANSFORMERS[name]) {
            await Promise.resolve().then(() => __importStar(require(`./transformers/${name}`))).then(mod => {
                // istanbul ignore else
                TRANSFORMERS[name] = mod.default;
            });
        }
        return TRANSFORMERS[name]({
            content,
            filename,
            map,
            options: typeof options === 'boolean' ? null : options,
        });
    }
    catch (e) {
        throwError(`Error transforming '${name}'.\n\nMessage:\n${e.message}\n\nStack:\n${e.stack}`);
    }
};
exports.importAny = async (...modules) => {
    try {
        const mod = await modules.reduce((acc, moduleName) => acc.catch(() => Promise.resolve().then(() => __importStar(require(moduleName)))), Promise.reject());
        return mod;
    }
    catch (e) {
        throw new Error(`Cannot find any of modules: ${modules}`);
    }
};
