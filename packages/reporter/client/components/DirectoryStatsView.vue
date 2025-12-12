<script setup lang="ts">
import { computed } from "vue";
import ProgressBar from "./ProgressBar.vue";
import Stats from "./Stats.vue";
import { statToString } from "../utils/statToString";
import type { DirectoryReport } from "../../shared/report-types";

const props = defineProps<{
  report: DirectoryReport;
  isRoot?: boolean;
}>();
const emit = defineEmits<{
  (e: "open-file", entity: string): void;
}>();

const overallPct = computed(() => props.report.stats.statements.pct);
const overallClass = computed(() => props.report.stats.statements.class);

const handleRowClick = (entity: string) => {
  emit("open-file", entity);
};
</script>

<template>
  <div class="dir-view" :class="{ 'dir-view--root': props.isRoot }">
    <div class="dir-view-main">
      <div class="dir-view-hero">
        <div class="dir-view-hero-icon">%</div>
        <div class="dir-view-hero-text">
          <div class="dir-view-hero-title">{{ props.report.name || "All files" }}</div>
          <div class="dir-view-hero-subtitle">Overall statements coverage</div>
          <div
            class="dir-view-hero-value"
            :style="{ color: `var(--stat-${overallClass})` }"
          >
            {{ overallPct.toFixed(2) }}%
          </div>
        </div>
      </div>
      <div class="dir-view-summary">
        <Stats :stats="props.report.stats" />
      </div>
    </div>
    <div
      v-if="!props.isRoot"
      class="dir-view-files"
    >
      <div class="dir-view-files-header">Files in this folder</div>
      <div
        v-for="child in props.report.childStats"
        :key="child.entity"
        class="dir-view-file-row"
        @click="handleRowClick(child.entity)"
      >
        <div class="dir-view-file-name">{{ child.name }}</div>
        <div class="dir-view-file-bar">
          <ProgressBar
            :value="child.stats.statements.pct"
            :color="`var(--stat-${child.stats.statements.class})`"
          />
        </div>
        <div
          class="dir-view-file-stat"
          :style="{ color: `var(--stat-${child.stats.statements.class})` }"
        >
          {{ statToString(child.stats.statements) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dir-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  background-color: #1e1e1e;
}

.dir-view--root {
  justify-content: center;
  align-items: center;
  background-color: #111111;
}

.dir-view-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.dir-view--root .dir-view-main {
  justify-content: center;
}

.dir-view-hero {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dir-view-hero-icon {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #0e639c;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
}

.dir-view-hero-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dir-view-hero-title {
  font-size: 18px;
  color: #e0e0e0;
}

.dir-view-hero-subtitle {
  font-size: 12px;
  color: #a0a0a0;
}

.dir-view-hero-value {
  font-size: 28px;
  color: #fce566;
  font-weight: 500;
}

.dir-view-summary {
  min-width: 260px;
}

.dir-view-files {
  flex: 1;
  min-height: 0;
  border-top: 1px solid #333333;
  padding-top: 8px;
  overflow: auto;
}

.dir-view-files-header {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #858585;
  margin-bottom: 6px;
}

.dir-view-file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
}

.dir-view-file-row:hover {
  background-color: #2a2d2e;
}

.dir-view-file-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #d4d4d4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dir-view-file-bar {
  width: 160px;
}

.dir-view-file-stat {
  width: 80px;
  font-size: 12px;
  text-align: right;
}
</style>
