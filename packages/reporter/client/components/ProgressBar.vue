<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  color: string;
}>()

const width = computed(() => `${props.value}%`)
</script>

<template>
  <div b-1 w="100%" h="100%">
    <div :style="{ width, background: color }" h="100%"></div>
  </div>
</template>
