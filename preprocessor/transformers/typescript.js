"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
function createFormatDiagnosticsHost(cwd) {
    return {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: () => cwd,
        getNewLine: () => typescript_1.default.sys.newLine,
    };
}
function formatDiagnostics(diagnostics, basePath) {
    if (Array.isArray(diagnostics)) {
        return typescript_1.default.formatDiagnosticsWithColorAndContext(diagnostics, createFormatDiagnosticsHost(basePath));
    }
    return typescript_1.default.formatDiagnostic(diagnostics, createFormatDiagnosticsHost(basePath));
}
function getFilenameExtension(filename) {
    filename = path_1.basename(filename);
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex <= 0)
        return '';
    return filename.substr(lastDotIndex + 1);
}
function isSvelteFile(filename) {
    const importExtension = getFilenameExtension(filename);
    return importExtension === 'svelte' || importExtension === 'html';
}
const IMPORTEE_PATTERN = /['"](.*?)['"]/;
function isValidSvelteImportDiagnostic(filename, diagnostic) {
    // TS2307: 'cannot find module'
    if (diagnostic.code !== 2307)
        return true;
    const importeeMatch = diagnostic.messageText.match(IMPORTEE_PATTERN);
    // istanbul ignore if
    if (!importeeMatch)
        return true;
    let [, importeePath] = importeeMatch;
    /** if we're not dealing with a relative path, assume the file exists */
    if (importeePath[0] !== '.')
        return false;
    /** if the importee is not a svelte file, do nothing */
    if (!isSvelteFile(importeePath))
        return true;
    importeePath = path_1.resolve(path_1.dirname(filename), importeePath);
    return fs_1.existsSync(importeePath) === false;
}
const importTransformer = context => {
    const visit = node => {
        if (typescript_1.default.isImportDeclaration(node)) {
            return typescript_1.default.createImportDeclaration(node.decorators, node.modifiers, node.importClause, node.moduleSpecifier);
        }
        return typescript_1.default.visitEachChild(node, child => visit(child), context);
    };
    return node => typescript_1.default.visitNode(node, visit);
};
const TS_TRANSFORMERS = {
    before: [importTransformer],
};
function compileFileFromMemory(compilerOptions, { filename, content }) {
    let code = content;
    let map;
    const realHost = typescript_1.default.createCompilerHost(compilerOptions, true);
    const dummyFileName = typescript_1.default.sys.resolvePath(filename);
    const isDummyFile = (fileName) => typescript_1.default.sys.resolvePath(fileName) === dummyFileName;
    const host = {
        fileExists: fileName => isDummyFile(fileName) || realHost.fileExists(fileName),
        getCanonicalFileName: fileName => isDummyFile(fileName)
            ? typescript_1.default.sys.useCaseSensitiveFileNames
                ? fileName
                : fileName.toLowerCase()
            : realHost.getCanonicalFileName(fileName),
        getSourceFile: (fileName, languageVersion, onError, shouldCreateNewSourceFile) => isDummyFile(fileName)
            ? typescript_1.default.createSourceFile(dummyFileName, code, languageVersion)
            : realHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile),
        readFile: fileName => isDummyFile(fileName) ? content : realHost.readFile(fileName),
        writeFile: (fileName, data) => {
            if (fileName.endsWith('.map')) {
                map = data;
            }
            else {
                code = data;
            }
        },
        directoryExists: realHost.directoryExists && realHost.directoryExists.bind(realHost),
        getCurrentDirectory: realHost.getCurrentDirectory.bind(realHost),
        getDirectories: realHost.getDirectories.bind(realHost),
        getNewLine: realHost.getNewLine.bind(realHost),
        getDefaultLibFileName: realHost.getDefaultLibFileName.bind(realHost),
        resolveModuleNames: realHost.resolveModuleNames && realHost.resolveModuleNames.bind(realHost),
        useCaseSensitiveFileNames: realHost.useCaseSensitiveFileNames.bind(realHost),
    };
    const program = typescript_1.default.createProgram([dummyFileName], compilerOptions, host);
    const emitResult = program.emit(undefined, undefined, undefined, undefined, TS_TRANSFORMERS);
    // collect diagnostics without svelte import errors
    const diagnostics = [
        ...emitResult.diagnostics,
        ...typescript_1.default.getPreEmitDiagnostics(program),
    ].filter(diagnostic => isValidSvelteImportDiagnostic(filename, diagnostic));
    return { code, map, diagnostics };
}
const transformer = ({ content, filename, options, }) => {
    // default options
    const compilerOptionsJSON = {
        moduleResolution: 'node',
        target: 'es6',
    };
    let basePath = process.cwd();
    if (options.tsconfigFile !== false || options.tsconfigDirectory) {
        const fileDirectory = (options.tsconfigDirectory ||
            path_1.dirname(filename));
        const tsconfigFile = options.tsconfigFile ||
            typescript_1.default.findConfigFile(fileDirectory, typescript_1.default.sys.fileExists);
        if (typeof tsconfigFile === 'string') {
            basePath = path_1.dirname(tsconfigFile);
            const { error, config } = typescript_1.default.readConfigFile(tsconfigFile, typescript_1.default.sys.readFile);
            if (error) {
                throw new Error(formatDiagnostics(error, basePath));
            }
            Object.assign(compilerOptionsJSON, config.compilerOptions);
        }
    }
    Object.assign(compilerOptionsJSON, options.compilerOptions);
    const { errors, options: convertedCompilerOptions, } = typescript_1.default.convertCompilerOptionsFromJson(compilerOptionsJSON, basePath);
    if (errors.length) {
        throw new Error(formatDiagnostics(errors, basePath));
    }
    const compilerOptions = {
        ...convertedCompilerOptions,
        allowNonTsExtensions: true,
    };
    if (compilerOptions.target === typescript_1.default.ScriptTarget.ES3 ||
        compilerOptions.target === typescript_1.default.ScriptTarget.ES5) {
        throw new Error(`Svelte only supports es6+ syntax. Set your 'compilerOptions.target' to 'es6' or higher.`);
    }
    let code, map, diagnostics;
    if (options.transpileOnly || compilerOptions.transpileOnly) {
        ({ outputText: code, sourceMapText: map, diagnostics } = typescript_1.default.transpileModule(content, {
            fileName: filename,
            compilerOptions: compilerOptions,
            reportDiagnostics: options.reportDiagnostics !== false,
            transformers: TS_TRANSFORMERS,
        }));
    }
    else {
        ({ code, map, diagnostics } = compileFileFromMemory(compilerOptions, {
            filename,
            content,
        }));
    }
    if (diagnostics.length > 0) {
        // could this be handled elsewhere?
        const formattedDiagnostics = formatDiagnostics(diagnostics, basePath);
        console.log(formattedDiagnostics);
    }
    return {
        code,
        map,
        diagnostics,
        dependencies: [],
    };
};
exports.default = transformer;
