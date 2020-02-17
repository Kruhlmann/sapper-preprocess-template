"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const globalifyPlugin = (root) => {
    root.walkAtRules(/keyframes$/, (atrule) => {
        if (!atrule.params.startsWith('-global-')) {
            atrule.params = '-global-' + atrule.params;
        }
    });
    root.walkRules((rule) => {
        if (rule.parent && rule.parent.name === 'keyframes') {
            return;
        }
        rule.selectors = rule.selectors.map((selector) => {
            return selector
                .split(' ')
                .map(selectorPart => {
                if (selectorPart.startsWith(':local')) {
                    return selectorPart.replace(/:local\((.+?)\)/g, '$1');
                }
                if (selectorPart.startsWith(':global')) {
                    return selectorPart;
                }
                return `:global(${selectorPart})`;
            })
                .join(' ');
        });
    });
};
const transformer = async ({ content, filename }) => {
    const { css, map: newMap } = await postcss_1.default()
        .use(globalifyPlugin)
        .process(content, { from: filename, map: true });
    return { code: css, map: newMap };
};
exports.default = transformer;
