<script setup lang="ts">
import CoverageCode from '../components/CoverageCode.vue'
import Nav from '../components/Nav.vue';
import Stats from '../components/Stats.vue';
import Footer from '../components/Footer.vue';

import type { FileReport } from "../../shared/report-types";
import { computed } from 'vue';
import { decompress } from 'lz-string';

const props = defineProps<{
  report: FileReport
}>();

const code = computed(() => decompress(props.report.fileContent))

</script>

<template>
  <div h-screen w-screen overflow="hidden" p="4" flex flex-col class="layout">
    <Nav :path="props.report.entity" />
    <Stats :stats="props.report.stats" />

    <section flex-grow>
      <CoverageCode :code="code" :coverage="props.report.detail" />
    </section>

    <Footer :unix="props.report.unix" />
  </div>
</template>
