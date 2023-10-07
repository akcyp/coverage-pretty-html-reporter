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
</style>

<template>
  <main p-2 flex flex-col flex-justify-between text-sm>
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
