<script setup lang="ts">
import OpenFilesTabs from "../components/OpenFilesTabs.vue";
import DirectoryStatsView from "../components/DirectoryStatsView.vue";

import type { DirectoryReport } from "../../shared/report-types";
import { computed } from "vue";

const props = defineProps<{
  report: DirectoryReport;
  path: string;
}>();

const emit = defineEmits<{
  (e: "open-file", entity: string): void;
  (e: "close"): void;
}>();

const openTabs = computed(() => [
  {
    id: props.report.entity || "root",
    label: props.report.name || "All files",
    path: props.report.entity,
  },
]);

const handleOpenFile = (entity: string) => {
  emit("open-file", entity);
};
</script>

<template>
  <div class="page-layout">
    <section class="page-layout-main">
      <OpenFilesTabs
        v-if="!props.report.root"
        :files="openTabs"
        :active-id="openTabs[0].id"
        :path="props.path || props.report.entity"
        @close="emit('close')"
      />
      <div class="page-layout-content">
        <DirectoryStatsView
          :report="props.report"
          :is-root="props.report.root"
          @open-file="handleOpenFile"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.page-layout-main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.page-layout-content {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
