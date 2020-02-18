# Sapper template

## Introduction

This template is built to support Typescript, pug and SCSS in a sapper project.

## Setup

```bash
git clone https://github.com/Kruhlmann/sapper-preprocess-template
cd sapper-template
yarn install
yarn run dev
```

## package.json scripts
 
* `yarn run dev` Runs the development server with hot reload.
* `yarn run doc` Builds TSDoc HTML documentation files for all files in the
[typescript](./src/typescript/) folder.
* `yarn run build` Builds the project for production. The build can be run with
`node sapper/__sapper__/build` or `yarn run start`
* `yarn run start` Runs the built solution in production mode
* `yarn run cy:run` Opens the cypress runner for all integration tests in
[cypress](./cypress/)
* `yarn run cy:open` Runs an interactive cypress window for running integration
tests
* `yarn run format:pug` Beautifies all pug files in the
[pug source directory](./src/pug/)
* `yarn run test` Executes cypress integration tests

## External source files

Typescript source files are located in the [src/typescript/](./src/typescript/)
directory. The naming convention follows the routes naming convention such that

All values and functions defined in included typescript source files are
avaliable for use in both svelte routes and included pug templates.

### File locations

* Typescript [src/typescript/file.ts](./src/typescript/)
* pug [src/pug/file.pug](./src/pug/)
* SCSS [src/scss/routes/file.scss](./src/scss/routes/)

### Naming convention

The naming convention for external files follows the routes naming convention
such that `src/routes/index.svelte` references

* `src/typescript/index.ts`.
* `src/pug/index.pug`.
* `src/scss/routes/index.scss`.

```html
<script lang="ts" src="../typescript/index.ts"></script>
<template lang="pug" src="../pug/index.pug"></template>
<style lang="scss" src="../scss/routes/index.scss"></style>
```

## Svelte properties in pug

Adding complicated tag parameters can be tricky when supporting pug. For instance the following syntax will be escaped such that `() => row_click(row)` becomes `() =&gt; row_click(row)`. This can be circumvented by using the long ECMAScript function declaration such that

```pug
+each('data_rows as row')
  row(on:click="{() => row_click(row)}")
```

becomes

```pug
+each('data_rows as row')
  row(on:click="{function() {row_click(row)}}")
```

This is only relevant for functions requiring a parameter as the following pug snippet will compile and execute as expected:

```pug
button(on:click="{btn_click}")
```
This snippet will simply execute a function, `btn_click` with the click event as the only parameter, simmilarly to regular svelte behavior.

## Reactive variables

Reactive variables are currently not supported in svelte-preprocess
([Source](https://github.com/sveltejs/svelte/issues/3670#issuecomment-541224931)).
