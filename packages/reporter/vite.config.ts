import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "./dist/client",
  },
  optimizeDeps: {
    include: ["vue"],
  },
  plugins: [
    vue(),
    {
      name: "load-metadata",
      apply: "build",
      transformIndexHtml: (html) => {
        return html.replace("<!-- !LOAD_METADATA! -->", `<script type="application/javascript" src="./loadcov.js"></script>`);
      },
    },
  ],
});
