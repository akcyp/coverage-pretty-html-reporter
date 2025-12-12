import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";
import "@vscode/codicons/dist/codicon.css";
import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import Tree from "primevue/tree";
import { createApp } from "vue";

import "@unocss/reset/tailwind.css";

import App from "./App.vue";
import "./styles/main.css";

const app = createApp(App);
app.use(PrimeVue);
app.component("Tree", Tree);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs",
  },
});
app.mount("#app");
