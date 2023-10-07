<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  path: string
}>()

const links = computed(() => (props.path ? `/${props.path}` : '').split('/').map((name, i, arr) => ({
  name: name === '' ? 'All files' : name,
  href: arr.slice(0, i + 1).join('/') || '/',
})))

</script>

<template>
  <nav text-lg pb-2>
    <span v-for="(link, index) of links">
      <RouterLink :to="link.href">{{ link.name }}</RouterLink>
      <span v-if="index !== links.length - 1" mx-1>/</span>
    </span>
  </nav>
</template>
