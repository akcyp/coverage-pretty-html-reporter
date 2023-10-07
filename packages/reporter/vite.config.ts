import vue from "@vitejs/plugin-vue";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import Unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  build: {
    outDir: "./dist/client",
    rollupOptions: {
      output: {
        manualChunks: {
          codemirror: ["codemirror", "@codemirror/state", "@codemirror/view", "@codemirror/lang-javascript", "@codemirror/language"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["vue"],
  },
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      shortcuts: {
        "bg-base": "bg-white dark:bg-[#111]",
        "bg-overlay": "bg-[#eee]:50 dark:bg-[#222]:50",
        "bg-header": "bg-gray-500:5",
        "bg-active": "bg-gray-500:8",
        "bg-hover": "bg-gray-500:20",
        "border-base": "border-gray-500:10",
        "tab-button": "font-light op50 hover:op80 h-full px-4",
        "tab-button-active": "op100 bg-gray-500:10",
      },
    }),
    {
      name: "load-metadata",
      apply: "build",
      transformIndexHtml: (html) => {
        return html.replace("<!-- !LOAD_METADATA! -->", `<script type="application/javascript" src="./loadcov.js"></script>`);
      },
    },
  ],
});
