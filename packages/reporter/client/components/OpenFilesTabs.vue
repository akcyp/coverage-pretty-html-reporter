<template>
  <div class="open-files">
    <div class="open-files-tabs">
      <div
        v-for="file in files"
        :key="file.id"
        class="open-files-tab"
        :class="{ 'open-files-tab--active': file.id === activeId }"
        @click="onSelect(file.id)"
      >
        <span
          class="open-files-tab__icon"
          :style="iconInfoFor(file).style"
        >
          {{ iconInfoFor(file).text }}
        </span>
        <span class="open-files-tab__title" :title="file.path || file.label">
          {{ file.label }}
        </span>
        <button
          type="button"
          class="open-files-tab__close"
          aria-label="Close file tab"
          @click.stop="onClose(file.id)"
        >
          <span class="codicon codicon-close"></span>
        </button>
      </div>
    </div>

    <div class="file-breadcrumbs">
      <span
        v-for="(segment, index) in breadcrumbs"
        :key="index"
        class="file-breadcrumbs__segment"
      >
        {{ segment }}
        <span
          v-if="index !== breadcrumbs.length - 1"
          class="file-breadcrumbs__sep codicon codicon-chevron-right"
        ></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import iconMap from "../utils/fileIcons.json";
interface OpenFileTab {
  id: string;
  label: string;
  path?: string;
}

const props = defineProps<{
  files: OpenFileTab[];
  activeId: string;
  path: string;
}>();

const breadcrumbs = computed(() => {
  const raw = props.path || "";
  return raw
    .split(/[\\/]/g)
    .filter(Boolean);
});

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "close", id: string): void;
}>();

type IconEntry = { text: string; bgColor: string; fgColor: string };
const icons = iconMap as Record<string, IconEntry>;

const extFromFile = (file: OpenFileTab) => {
  const name = file.label || file.path || "";
  const match = name.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
};

const iconInfoFor = (file: OpenFileTab) => {
  const ext = extFromFile(file);
  const key = ext || "dir";
  const fromMap = icons[key] ?? icons.default ?? {
    text: "",
    bgColor: "#3c3c3c",
    fgColor: "#ffffff",
  };
  const text = fromMap.text || (ext ? ext.toUpperCase() : "");
  return {
    text,
    style: {
      backgroundColor: fromMap.bgColor,
      color: fromMap.fgColor,
    } as const,
  };
};


const onSelect = (id: string) => {
  emit("select", id);
};

const onClose = (id: string) => {
  emit("close", id);
};
</script>

<style scoped>
.open-files {
  display: flex;
  flex-direction: column;
}

.open-files-tabs {
  display: flex;
  align-items: stretch;
  background-color: #222222; /* matches VS Code tab bar */
  border-bottom: 1px solid #222222;
  user-select: none;
  height: 35px; /* --editor-group-tab-height */
}

.open-files-tab {
  display: inline-flex;
  align-items: center;
  max-width: 220px;
  padding: 0 12px;
  font-size: 13px;
  color: #cccccc;
  background-color: #2d2d2d;
  border-right: 1px solid #222222;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.open-files-tab::after {
  /* bottom border for all tabs */
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: transparent;
}

.open-files-tab--active {
  background-color: #1e1e1e;
  color: #fce566; /* VS Code active tab foreground */
}

.open-files-tab--active::after {
  /* VS Code yellow active tab underline */
  background-color: #fce566;
}

.open-files-tab__title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.open-files-tab__close {
  margin-left: 8px;
  border: none;
  padding: 0 3px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.open-files-tab__close:hover {
  background-color: #3e3e3e;
}

.open-files-tab__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 600;
}

.file-breadcrumbs {
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 12px;
  line-height: 22px;
  font-size: 13px;
  background-color: #222222;
  color: #8b888f;
  border-bottom: 1px solid #222222;
  overflow: hidden;
}

.file-breadcrumbs__segment {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  white-space: nowrap;
  cursor: pointer;
  align-self: center;
  height: 100%;
  outline: none;
}

.file-breadcrumbs__sep {
  margin: 0 4px;
  font-size: 13px;
  line-height: 22px;
}
</style>
