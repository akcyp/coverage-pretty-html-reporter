<script setup lang="ts">
import { decompress } from "lz-string";
import { computed } from "vue";
import type { FileReport } from "../../shared/report-types";
import CoverageCode from "../components/CoverageCode.vue";
import CoverageStatusBar from "../components/CoverageStatusBar.vue";
import OpenFilesTabs from "../components/OpenFilesTabs.vue";

const props = defineProps<{
  report: FileReport;
}>();

const emit = defineEmits<(e: "close") => void>();

const code = computed(() => decompress(props.report.fileContent));

// For now we only ever have one open file (the current report),
// but this component is ready for multiple tabs in the future.
const openFiles = computed(() => [
  {
    id: props.report.entity,
    label: props.report.name,
    path: props.report.entity,
  },
]);
</script>

<template>
  <div class="page-layout">
    <section class="page-layout-main">
      <OpenFilesTabs
        :files="openFiles"
        :active-id="props.report.entity"
        :path="props.report.path || props.report.entity"
        @close="emit('close')"
      />
      <CoverageStatusBar :stats="props.report.stats" />
      <div class="page-layout-content">
        <CoverageCode :code="code" :coverage="props.report.detail" />
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
