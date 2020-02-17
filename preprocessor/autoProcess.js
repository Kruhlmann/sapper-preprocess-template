"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strip_indent_1 = __importDefault(require("strip-indent"));
const package_json_1 = require("svelte/package.json");
const utils_1 = require("./utils");
const SVELTE_MAJOR_VERSION = +package_json_1.version[0];
const ALIAS_OPTION_OVERRIDES = {
    sass: {
        indentedSyntax: true,
    },
};
function autoPreprocess({ onBefore, aliases, markupTagName = 'template', preserve = [], ...rest } = {}) {
    markupTagName = markupTagName.toLocaleLowerCase();
    const optionsCache = {};
    const transformers = rest.transformers || rest;
    const markupPattern = new RegExp(`<${markupTagName}([\\s\\S]*?)(?:>([\\s\\S]*)<\\/${markupTagName}>|/>)`);
    if (aliases && aliases.length) {
        utils_1.addLanguageAlias(aliases);
    }
    const getTransformerOptions = (lang, alias) => {
        if (utils_1.isFn(transformers[alias]))
            return transformers[alias];
        if (utils_1.isFn(transformers[lang]))
            return transformers[lang];
        if (optionsCache[alias] != null)
            return optionsCache[alias];
        const opts = {};
        if (typeof transformers[lang] === 'object') {
            Object.assign(opts, transformers[lang]);
        }
        if (lang !== alias) {
            Object.assign(opts, ALIAS_OPTION_OVERRIDES[alias] || null);
            if (typeof transformers[alias] === 'object') {
                Object.assign(opts, transformers[alias]);
            }
        }
        return (optionsCache[alias] = opts);
    };
    const getTransformerTo = (targetLanguage) => async (svelteFile) => {
        const { content, filename, lang, alias, dependencies } = await utils_1.parseFile(svelteFile, targetLanguage);
        if (preserve.includes(lang) || preserve.includes(alias)) {
            return;
        }
        if (lang === targetLanguage) {
            return { code: content, dependencies };
        }
        if (transformers[lang] === false || transformers[alias] === false) {
            utils_1.throwUnsupportedError(alias, filename);
        }
        const transformed = await utils_1.runTransformer(lang, getTransformerOptions(lang, alias), { content: strip_indent_1.default(content), filename });
        return {
            ...transformed,
            dependencies: utils_1.concat(dependencies, transformed.dependencies),
        };
    };
    const scriptTransformer = getTransformerTo('javascript');
    const cssTransformer = getTransformerTo('css');
    const markupTransformer = getTransformerTo('html');
    return {
        async markup({ content, filename }) {
            if (utils_1.isFn(onBefore)) {
                // istanbul ignore next
                if (SVELTE_MAJOR_VERSION >= 3) {
                    console.warn('[svelte-preprocess] For svelte >= v3, instead of onBefore(), prefer to prepend a preprocess object to your array of preprocessors');
                }
                content = await onBefore({ content, filename });
            }
            const templateMatch = content.match(markupPattern);
            /** If no <template> was found, just return the original markup */
            if (!templateMatch) {
                return { code: content };
            }
            const [fullMatch, attributesStr, templateCode] = templateMatch;
            /** Transform an attribute string into a key-value object */
            const attributes = attributesStr
                .split(/\s+/)
                .filter(Boolean)
                .reduce((acc, attr) => {
                const [name, value] = attr.split('=');
                // istanbul ignore next
                acc[name] = value ? value.replace(/['"]/g, '') : true;
                return acc;
            }, {});
            /** Transform the found template code */
            let { code, map, dependencies } = await markupTransformer({
                content: templateCode,
                attributes,
                filename,
            });
            code =
                content.slice(0, templateMatch.index) +
                    code +
                    content.slice(templateMatch.index + fullMatch.length);
            return { code, map, dependencies };
        },
        script: scriptTransformer,
        async style({ content, attributes, filename }) {
            let { code, map, dependencies } = await cssTransformer({
                content,
                attributes,
                filename,
            });
            if (transformers.postcss) {
                const transformed = await utils_1.runTransformer('postcss', transformers.postcss, { content: code, map, filename });
                code = transformed.code;
                map = transformed.map;
                dependencies = utils_1.concat(dependencies, transformed.dependencies);
            }
            if (attributes.global) {
                const transformed = await utils_1.runTransformer('globalStyle', null, {
                    content: code,
                    map,
                    filename,
                });
                code = transformed.code;
                map = transformed.map;
            }
            return { code, map, dependencies };
        },
    };
}
exports.autoPreprocess = autoPreprocess;
