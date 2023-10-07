import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import type { Report } from "../shared/report-types";

import "@unocss/reset/tailwind.css";
import "uno.css";
import App from "./App.vue";
import "./styles/main.css";

import DirectoryPage from "./pages/directory.vue";
import FilePage from "./pages/file.vue";

import cov from "./cov.json";
const report = cov as Report[];
console.log(report);

const app = createApp(App);
app.use(
  createRouter({
    history: createWebHashHistory(),
    routes: report.map((report) => {
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
  }),
);

app.mount("#app");
