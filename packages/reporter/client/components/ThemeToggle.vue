<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type Theme = "light" | "dark";

const theme = ref<Theme>("dark");
const isFramed = ref(false);
let mediaQuery: MediaQueryList | null = null;
let messageListener: ((event: MessageEvent) => void) | null = null;

const applyTheme = (next: Theme, persist = true) => {
  theme.value = next;
  const root = document.documentElement;
  if (next === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  if (persist) {
    try {
      window.localStorage.setItem("coverage-theme", next);
    } catch {
      // ignore
    }
  }
  try {
    window.dispatchEvent(new CustomEvent("coverage-theme-changed", { detail: next }));
  } catch {
    // ignore
  }
};

const detectPreferredTheme = (): Theme => {
  try {
    const stored = window.localStorage.getItem("coverage-theme");
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
      return "dark";
    }
  } catch {
    // ignore
  }
  return "light";
};

const toggleTheme = () => {
  const next: Theme = theme.value === "dark" ? "light" : "dark";
  applyTheme(next);
};

const handleSystemThemeChange = (event: MediaQueryListEvent) => {
  // If user explicitly chose a theme, don't override with system changes
  try {
    const stored = window.localStorage.getItem("coverage-theme");
    if (stored === "light" || stored === "dark") return;
  } catch {
    // ignore
  }
  applyTheme(event.matches ? "dark" : "light", false);
};

const handleThemeMessage = (event: MessageEvent) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  const { type, theme } = data as { type?: string; theme?: Theme };

  if (type === "coverage-theme" && (theme === "dark" || theme === "light")) {
    applyTheme(theme);
  }
};

onMounted(() => {
  // Detect if running inside an iframe
  try {
    isFramed.value = window.self !== window.top;
  } catch {
    isFramed.value = true;
  }

  // Apply initial theme from storage or system preference
  const initialTheme = detectPreferredTheme();
  applyTheme(initialTheme, false);

  if (window.matchMedia) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  messageListener = (event: MessageEvent) => handleThemeMessage(event);
  window.addEventListener("message", messageListener);
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleSystemThemeChange);
    }
    mediaQuery = null;
  }
  if (messageListener) {
    window.removeEventListener("message", messageListener);
    messageListener = null;
  }
});
</script>

<template>
  <button
    v-if="!isFramed"
    class="theme-toggle"
    type="button"
    :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <i
      class="codicon codicon-color-mode"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 50;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: 1px solid var(--theme-toggle-border);
  background-color: var(--theme-toggle-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-toggle-fg);
  cursor: pointer;
  padding: 0;
}

.theme-toggle:hover {
  background-color: var(--theme-toggle-hover-bg);
}

.theme-toggle .codicon {
  font-size: 14px;
}
</style>
