/**
 * File rollup.config.js created on 25-05-2020.
 * Last modified on 2020-05-25T23:48:12 CEST
 *
 * @fileoverview Rollup configuration for building the project.
 * @license GPL-3.0-or-later
 * @author Andreas Krühlmann <echo "YW5kcmVhc0BrcnVobG1hbm4uZGV2Cg==" | base64 -d>
 * @since 0.0.1
 * @format
 */

import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import config from "sapper/config/rollup.js";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import preprocess from "svelte-preprocess";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const postcss_plugins = [
    require("postcss-import")(),
    require("postcss-url")(),
    require("autoprefixer")(),
    require("postcss-zindex")(),
    require("postcss-fakeid")(),
];

export default {
    client: {
        input: config.client.input(),
        output: config.client.output(),
        plugins: [
            json(),
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                dev,
                hydratable: true,
                emitCss: true,
                preprocess: preprocess({
                    postcss: {
                        plugins: postcss_plugins,
                    },
                }),
                onwarn: (warning, handler) => {
                    if (warning.code === "css-unused-selector") {
                        return;
                    }
                    handler(warning);
                },
            }),
            resolve(),
            commonjs(),
            !dev &&
                terser({
                    module: true,
                }),
        ],
        preserveEntrySignatures: false,
    },

    server: {
        preserveEntrySignatures: "strict",
        input: config.server.input(),
        output: config.server.output(),
        plugins: [
            json(),
            replace({
                "process.browser": false,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                generate: "ssr",
                dev,
                preprocess: preprocess({
                    postcss: {
                        plugins: postcss_plugins,
                    },
                }),
                onwarn: (warning, handler) => {
                    if (warning.code === "css-unused-selector") {
                        return;
                    }
                    handler(warning);
                },
            }),
            resolve(),
            commonjs(),
        ],
        external: Object.keys(pkg.dependencies).concat(
            require("module").builtinModules ||
                Object.keys(process.binding("natives")),
        ),
    },

    serviceworker: {
        input: config.serviceworker.input(),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            commonjs(),
            !dev && terser(),
        ],
        preserveEntrySignatures: false,
    },
};
