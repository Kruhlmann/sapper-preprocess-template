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
    async script(svelteFile) {
        const { default: transformer } = await Promise.resolve().then(() => __importStar(require('../transformers/coffeescript')));
        const { content, filename, lang, dependencies } = await utils_1.parseFile(svelteFile, 'javascript');
        if (lang !== 'coffeescript')
            return { code: content };
        const transformed = await transformer({ content, filename, options });
        return {
            ...transformed,
            dependencies: utils_1.concat(dependencies, transformed.dependencies),
        };
    },
});
