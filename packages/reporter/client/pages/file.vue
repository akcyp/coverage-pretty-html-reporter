<script setup lang="ts">
import Nav from '../components/Nav.vue';
import Stats from '../components/Stats.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div h-screen w-screen overflow="hidden" p="4" flex flex-col>
    <Nav />
    <Stats />

    <section>
      <!-- <CoverageCode :code="code" :coverage="coverage" /> -->
    </section>

    <Footer :date="new Date()" />
  </div>
</template>
