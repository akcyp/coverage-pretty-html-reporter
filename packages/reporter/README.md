# coverage-pretty-html-reporter

> [!WARNING]
> This package is still in the experimental phase. You can expect new functionalities, but with this comes the possibility of more frequent errors

Directory summary (light theme)                                                                 |  File coverage (dark theme)
:----------------------------------------------------------------------------------------------:|:----------------------------:
![Summary](https://github.com/akcyp/coverage-pretty-html-reporter/raw/main/images/summary.png)  | ![Coverage](https://github.com/akcyp/coverage-pretty-html-reporter/raw/main/images/file.png)

## Installation

You can use your favorite package manager

```sh
npm i -D coverage-pretty-html-reporter
yarn add -D coverage-pretty-html-reporter
pnpm add -D coverage-pretty-html-reporter
bun add -D coverage-pretty-html-reporter
```

Then configure `nyc` / `c8` to use *coverage-pretty-html-reporter*
```sh
nyc --reporter=coverage-pretty-html-reporter mocha # ...
c8 --reporter=coverage-pretty-html-reporter mocha # ...
```

If you are using `jest` / `vitest` or other framework you may place correct config ex.:
```js
/** @type {import('jest').Config} */
const config = {
  coverageReporters: ['coverage-pretty-html-reporter'],
};
```
```js
import { defineConfig } from "vitest/config";
export default defineConfig({
  plugins: [],
  test: {
    coverage: {
      enabled: true,
      // @ts-expect-error
      reporter: ["coverage-pretty-html-reporter"],
    },
  },
});
```

## Reading coverage report

`coverage-pretty-html-reporter` does not support viewing web-page locally (via file:// protocol) (i.e. double clicking the .html file). You need to publish coverage directory on local network ex.:

```sh
# When using npm
npx http-server ./coverage
# When using pnpm
pnpm dlx http-server ./coverage
# When using bun
bunx http-server ./coverage
```
