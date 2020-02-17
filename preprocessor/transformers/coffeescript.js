"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coffeescript_1 = __importDefault(require("coffeescript"));
const transformer = ({ content, filename, options, }) => {
    const { js: code, sourceMap: map } = coffeescript_1.default.compile(content, {
        filename,
        sourceMap: true,
        ...options,
    });
    return { code, map };
};
exports.default = transformer;
