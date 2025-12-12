<script setup lang="ts">
import type { SummaryStats } from "../../shared/report-types";
import { statToString } from "../utils/statToString";

const props = defineProps<{
  stats: SummaryStats;
}>();
</script>

<template>
  <div class="coverage-status-bar">
    <span :class="[`stat-${props.stats.statements.class}`]">
      Statements: {{ statToString(props.stats.statements) }}
    </span>
    <span :class="[`stat-${props.stats.branches.class}`]">
      Branches: {{ statToString(props.stats.branches) }}
    </span>
    <span :class="[`stat-${props.stats.functions.class}`]">
      Functions: {{ statToString(props.stats.functions) }}
    </span>
    <span :class="[`stat-${props.stats.lines.class}`]">
      Lines: {{ statToString(props.stats.lines) }}
    </span>
  </div>
</template>

<style scoped>
.coverage-status-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  background-color: var(--panel-bg);
  border-bottom: 1px solid var(--panel-border);
}
</style>
