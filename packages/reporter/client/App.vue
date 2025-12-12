<script setup lang="ts">
import { computed, ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";
import FileTree from "./components/FileTree.vue";
import DirectoryPage from "./pages/directory.vue";
import FilePage from "./pages/file.vue";
import Footer from "./components/Footer.vue";
import devCov from "./demoReport.json";
import type { Report, FileReport, DirectoryReport } from "../shared/report-types";

// biome-ignore lint/style/noNonNullAssertion:
const reports = (import.meta.env.MODE === "development"
  ? (devCov as Report[])
  : (window.reports as Report[]));

const fileReports = computed(() => reports.filter((r) => r.type === "file") as FileReport[]);
const directoryReports = computed(
  () => reports.filter((r) => r.type === "directory") as DirectoryReport[],
);

const rootDirectory = computed(
  () => directoryReports.value.find((d) => d.root) ?? directoryReports.value[0] ?? null,
);

type ViewMode = "directory" | "file";

const currentView = ref<ViewMode>("directory");
const selectedDirectory = ref<DirectoryReport | null>(rootDirectory.value);
const selectedFile = ref<FileReport | null>(null);

const directoryPathMap = computed(() => {
  const map = new Map<string, string>();
  for (const file of fileReports.value) {
    const entity = file.entity || "";
    const parts = entity.split("/");
    parts.pop();
    const dirEntity = parts.join("/");
    const existing = map.get(dirEntity);
    if (existing) continue;
    const filePath = file.path || entity;
    const pathParts = filePath.split("/");
    pathParts.pop();
    map.set(dirEntity, pathParts.join("/"));
  }
  return map;
});

const currentPath = computed(() => {
  if (currentView.value === "file" && selectedFile.value) return selectedFile.value.entity;
  if (selectedDirectory.value) return selectedDirectory.value.entity;
  return "";
});

const setHashForRoot = () => {
  if (window.location.hash) {
    window.location.hash = "";
  }
};

const setHashForFile = (entity: string) => {
  const target = `#file=${encodeURIComponent(entity)}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
  }
};

const setHashForDirectory = (entity: string) => {
  const target = `#dir=${encodeURIComponent(entity)}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
  }
};
const currentDirectoryPath = computed(() => {
  if (!selectedDirectory.value || selectedDirectory.value.root) return "";
  return directoryPathMap.value.get(selectedDirectory.value.entity) ?? selectedDirectory.value.entity;
});

const currentUnix = computed<number | null>(() => {
  if (currentView.value === "file" && selectedFile.value) return selectedFile.value.unix;
  if (currentView.value === "directory" && selectedDirectory.value) return selectedDirectory.value.unix;
  return null;
});

const handleSelectFile = (report: FileReport) => {
  selectedFile.value = report;
  selectedDirectory.value = null;
  currentView.value = "file";
  setHashForFile(report.entity);
};

const handleSelectDirectoryStats = (dir: DirectoryReport) => {
  selectedDirectory.value = dir;
  selectedFile.value = null;
  currentView.value = "directory";
  if (!dir.root) setHashForDirectory(dir.entity);
  else setHashForRoot();
};

const goToRootView = () => {
  selectedDirectory.value = rootDirectory.value;
  selectedFile.value = null;
  currentView.value = "directory";
  setHashForRoot();
};

const applyHashTarget = () => {
  const hash = window.location.hash || "";
  const match = hash.match(/^#(file|dir)=(.+)$/);
  if (!match) {
    goToRootView();
    return;
  }
  const [, kind, raw] = match;
  const entity = decodeURIComponent(raw);
  if (kind === "file") {
    openFileByEntity(entity);
  } else {
    const dir = directoryReports.value.find((d) => d.entity === entity);
    if (dir) handleSelectDirectoryStats(dir);
  }
};

let hashListener: (() => void) | null = null;

onMounted(() => {
  applyHashTarget();
  hashListener = () => applyHashTarget();
  window.addEventListener("hashchange", hashListener);
});

onBeforeUnmount(() => {
  if (hashListener) {
    window.removeEventListener("hashchange", hashListener);
    hashListener = null;
  }
});

const openFileByEntity = (entity: string) => {
  const found = fileReports.value.find((f) => f.entity === entity);
  if (found) handleSelectFile(found);
};
</script>

<template>
  <div class="app-shell">
    <div class="app-layout">
      <aside class="app-sidebar">
        <FileTree
          :reports="reports"
          :current-path="currentPath"
          @select-file="handleSelectFile"
          @select-directory-stats="handleSelectDirectoryStats"
        />
      </aside>
      <main class="app-main">
        <div class="app-main-content">
          <DirectoryPage
            v-if="currentView === 'directory' && selectedDirectory"
            :key="selectedDirectory.entity"
            :report="selectedDirectory"
            :path="currentDirectoryPath"
            @open-file="openFileByEntity"
            @close="goToRootView"
          />
          <FilePage
            v-else-if="currentView === 'file' && selectedFile"
            :key="selectedFile.entity"
            :report="selectedFile"
            @close="goToRootView"
          />
        </div>
      </main>
    </div>
    <Footer v-if="currentUnix !== null" :unix="currentUnix" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.app-sidebar {
  width: 260px;
  background-color: #252526;
  border-right: 1px solid #333333;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-main-content {
  flex: 1;
  min-height: 0;
}
</style>
