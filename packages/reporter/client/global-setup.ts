/// <reference types="vite-plugin-pages/client" />

import { createRouter as _createRouter, createWebHashHistory } from "vue-router";
import routes from "virtual:generated-pages";

import "@unocss/reset/tailwind.css";
import "uno.css";
import { Directive } from "vue";
import "./styles/main.css";

export const directives: Record<string, Directive> = {};

export function createRouter() {
  return _createRouter({
    history: createWebHashHistory(),
    routes,
  });
}

export const plugins = [createRouter];
