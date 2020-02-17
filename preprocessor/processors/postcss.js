"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/** Adapted from https://github.com/TehShrike/svelte-preprocess-postcss */
exports.default = (options) => ({
    async style(svelteFile) {
        const { default: transformer } = await Promise.resolve().then(() => __importStar(require('../transformers/postcss')));
        const { content, filename, dependencies } = await utils_1.parseFile(svelteFile, 'css');
        /** If manually passed a plugins array, use it as the postcss config */
        const transformed = await transformer({ content, filename, options });
        return {
            ...transformed,
            dependencies: utils_1.concat(dependencies, transformed.dependencies),
        };
    },
});
