import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const external = ["istanbul-lib-report", 'lz-string', 'node:fs', 'node:path'];

export default [
  {
    input: "./node/index.ts",
    output: {
      dir: "dist",
      format: "commonjs",
    },
    external,
    plugins: [
      commonjs(),
      esbuild({
        target: "node14",
        tsconfig: "tsconfig.node.json",
      }),
    ],
  },
  {
    input: "./node/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    external,
    plugins: [
      dts({
        tsconfig: "tsconfig.node.json",
      }),
    ],
  },
];
