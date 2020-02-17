"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const process = async ({ plugins, parser, syntax }, content, filename, sourceMap) => {
    const { css, map, messages } = await postcss_1.default(plugins).process(content, {
        from: filename,
        map: {
            prev: sourceMap,
        },
        parser,
        syntax,
    });
    const dependencies = messages.reduce((acc, msg) => {
        // istanbul ignore if
        if (msg.type !== 'dependency')
            return acc;
        acc.push(msg.file);
        return acc;
    }, []);
    return { code: css, map, dependencies };
};
/** Adapted from https://github.com/TehShrike/svelte-preprocess-postcss */
const transformer = async ({ content, filename, options, map = undefined, }) => {
    if (options && Array.isArray(options.plugins)) {
        return process(options, content, filename, map);
    }
    try {
        /** If not, look for a postcss config file */
        const { default: postcssLoadConfig } = await Promise.resolve().then(() => __importStar(require(`postcss-load-config`)));
        options = await postcssLoadConfig(options, options ? options.configFilePath : undefined);
    }
    catch (e) {
        /** Something went wrong, do nothing */
        // istanbul ignore next
        if (e.code === 'MODULE_NOT_FOUND') {
            console.error(`[svelte-preprocess] PostCSS configuration was not passed. If you expect to load it from a file, make sure to install "postcss-load-config" and try again ʕ•ᴥ•ʔ`);
        }
        else {
            console.error(e);
        }
        return { code: content, map, dependencies: [] };
    }
    return process(options, content, filename, map);
};
exports.default = transformer;
