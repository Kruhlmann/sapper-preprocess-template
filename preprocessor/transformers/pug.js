"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const detect_indent_1 = __importDefault(require("detect-indent"));
const pug_1 = __importDefault(require("pug"));
// Mixins to use svelte template features
const GET_MIXINS = (identationType) => `mixin if(condition)
%_| {#if !{condition}}
%_block
%_| {/if}

mixin else
%_| {:else}
%_block

mixin elseif(condition)
%_| {:else if !{condition}}
%_block

mixin each(loop)
%_| {#each !{loop}}
%_block
%_| {/each}

mixin await(promise)
%_| {#await !{promise}}
%_block
%_| {/await}

mixin then(answer)
%_| {:then !{answer}}
%_block

mixin catch(error)
%_| {:catch !{error}}
%_block

mixin debug(variables)
%_| {@debug !{variables}}`.replace(/%_/g, identationType === 'tab' ? '\t' : '  ');
const transformer = async ({ content, filename, options, }) => {
    var _a;
    options = {
        doctype: 'html',
        filename,
        ...options,
    };
    const { type: identationType } = detect_indent_1.default(content);
    const code = `${GET_MIXINS(identationType)}\n${content}`;
    const compiled = pug_1.default.compile(code, {
        compileDebug: false,
        filename,
        ...options,
    });
    return {
        code: compiled(),
        dependencies: (_a = compiled.dependencies, (_a !== null && _a !== void 0 ? _a : null)),
    };
};
exports.default = transformer;
