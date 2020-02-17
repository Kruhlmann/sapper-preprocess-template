"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
let sass;
const transformer = async ({ content, filename, options = {}, }) => {
    if (sass == null) {
        ({ default: sass } = await utils_1.importAny('node-sass', 'sass'));
    }
    options = {
        sourceMap: true,
        ...options,
        includePaths: utils_1.getIncludePaths(filename, options.includePaths),
        outFile: filename + '.css',
    };
    options.data = options.data ? options.data + content : content;
    // scss errors if passed an empty string
    if (options.data.length === 0) {
        return { code: options.data };
    }
    return new Promise((resolve, reject) => {
        sass.render(options, (err, result) => {
            if (err)
                return reject(err);
            resolve({
                code: result.css.toString(),
                map: result.map ? result.map.toString() : undefined,
                dependencies: result.stats.includedFiles,
            });
        });
    });
};
exports.default = transformer;
