<script setup lang="ts">
import type { SummaryStats } from '../../shared/report-types';
import { statToString } from '../utils/statToString'

const props = defineProps<{
  stats: SummaryStats
}>()
</script>

<style>
.stat-low {
  color: var(--stat-low);
}
.stat-medium {
  color: var(--stat-medium);
}
.stat-high {
  color: var(--stat-high);
}
  
.stats-root {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.875rem;
}
</style>

<template>
  <main class="stats-root">
    <div :class="[`stat-${props.stats.statements.class}`]">
      Statements: {{ statToString(props.stats.statements) }}
    </div>
    <div :class="[`stat-${props.stats.branches.class}`]">
      Branches: {{ statToString(props.stats.branches) }}
    </div>
    <div :class="[`stat-${props.stats.functions.class}`]">
      Functions: {{ statToString(props.stats.functions) }}
    </div>
    <div :class="[`stat-${props.stats.lines.class}`]">
      Lines: {{ statToString(props.stats.lines) }}
    </div>
  </main>
</template>
