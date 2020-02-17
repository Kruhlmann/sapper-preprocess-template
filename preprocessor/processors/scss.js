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
exports.default = (options) => ({
    async style(svelteFile) {
        const { default: transformer } = await Promise.resolve().then(() => __importStar(require('../transformers/scss')));
        const { content, filename, lang, alias, dependencies } = await utils_1.parseFile(svelteFile, 'css');
        if (lang !== 'scss')
            return { code: content };
        if (alias === 'sass') {
            options = {
                ...options,
                indentedSyntax: true,
            };
        }
        const transformed = await transformer({
            content,
            filename,
            options,
        });
        return {
            ...transformed,
            dependencies: utils_1.concat(dependencies, transformed.dependencies),
        };
    },
});
