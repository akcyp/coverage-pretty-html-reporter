import { resolve } from "pathe";
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Pages from "vite-plugin-pages";

export default defineConfig({
  build: {
    outDir: "./dist/client",
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
    Components({
      dirs: ["client/components"],
      dts: resolve(__dirname, "./client/components.d.ts"),
    }),
    Pages({
      dirs: ["client/pages"],
    }),
    AutoImport({
      dirs: ["./client/composables"],
      dts: resolve(__dirname, "./client/auto-imports.d.ts"),
      imports: ["vue", "vue-router"],
      injectAtEnd: true,
    }),
  ],
});
