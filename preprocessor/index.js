"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoProcess_1 = require("./autoProcess");
// default auto processor
// crazy es6/cjs export mix for backward compatibility
exports.default = exports = module.exports = autoProcess_1.autoPreprocess;
// stand-alone processors to be included manually */
var pug_1 = require("./processors/pug");
exports.pug = pug_1.default;
var coffeescript_1 = require("./processors/coffeescript");
exports.coffeescript = coffeescript_1.default;
var typescript_1 = require("./processors/typescript");
exports.typescript = typescript_1.default;
var less_1 = require("./processors/less");
exports.less = less_1.default;
var scss_1 = require("./processors/scss");
exports.scss = scss_1.default;
exports.sass = scss_1.default;
var stylus_1 = require("./processors/stylus");
exports.stylus = stylus_1.default;
var postcss_1 = require("./processors/postcss");
exports.postcss = postcss_1.default;
var globalStyle_1 = require("./processors/globalStyle");
exports.globalStyle = globalStyle_1.default;
