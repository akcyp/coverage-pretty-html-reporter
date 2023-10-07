<script setup lang="ts">
import Nav from '../components/Nav.vue';
import Stats from '../components/Stats.vue';
import Footer from '../components/Footer.vue';
import ProgressBar from '../components/ProgressBar.vue';

import type { DirectoryReport } from "../../shared/report-types";
import { statToString } from '../utils/statToString';

const props = defineProps<{
  report: DirectoryReport
}>();
</script>

<style>
.stats-table td {
  border: 1px solid black;
  min-width: 100px;
}
html.dark .stats-table td {
  border: 1px solid white;
}
</style>

<template>
  <div h-screen w-screen overflow="hidden" p="4" flex flex-col class="layout">
    <Nav :path="props.report.entity" />
    <Stats :stats="props.report.stats" />

    <section w-full h-full>
      <table w-full h-1 class="stats-table">
        <thead>
          <th>File</th>
          <th></th>
          <th>Statements</th>
          <th>Branches</th>
          <th>Functions</th>
          <th>Lines</th>
        </thead>
        <tbody>
          <tr
            p="x-2 y-1"
            border-rounded cursor-pointer
            hover="bg-active"
            v-for="child of props.report.childStats"
            @click="$router.push({ path: `/${child.entity}` })"
          >
            <td text-sm text-center truncate font-light p-1>
              {{ child.name }}
            </td>
            <td p-2 w-50>
              <ProgressBar :value="child.stats.statements.pct" :color="`var(--stat-${child.stats.statements.class})`" />
            </td>
            <td text-sm p-1 text-center :style="{ color: `var(--stat-${child.stats.statements.class})` }">
              {{ statToString(child.stats.statements) }}
            </td>
            <td text-sm p-1 text-center :style="{ color: `var(--stat-${child.stats.branches.class})` }">
              {{ statToString(child.stats.branches) }}
            </td>
            <td text-sm p-1 text-center :style="{ color: `var(--stat-${child.stats.functions.class})` }">
              {{ statToString(child.stats.functions) }}
            </td>
            <td text-sm p-1 text-center :style="{ color: `var(--stat-${child.stats.lines.class})` }">
              {{ statToString(child.stats.lines) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <Footer :unix="props.report.unix" />
  </div>
</template>
