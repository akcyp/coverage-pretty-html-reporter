import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "@unocss/reset/tailwind.css";
import "uno.css";
import App from "./App.vue";
import "./styles/main.css";

import DirectoryPage from "./pages/directory.vue";
import FilePage from "./pages/file.vue";

import devCov from "./demoReport.json";

// biome-ignore lint/style/noNonNullAssertion:
const reports = import.meta.env.MODE === "development" ? devCov : window.reports!;

const router = createRouter({
  history: createWebHistory(),
  routes: reports.map((report) => {
    const component = report.type === "file" ? FilePage : DirectoryPage;
    const path = report.type === "directory" && report.root ? "/" : `/${report.entity}`;
    return {
      path,
      component,
      props: {
        report,
      },
    };
  }),
});

const app = createApp(App);
app.use(router);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs",
  },
});
app.mount("#app");
