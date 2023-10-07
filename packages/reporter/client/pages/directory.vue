<script setup lang="ts">
import Nav from '../components/Nav.vue';
import Stats from '../components/Stats.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div h-screen w-screen overflow="hidden" p="4" flex flex-col>
    <Nav />
    <Stats />

    <section w="100%" h="60%">
      <table w="100%" h-1>
        <thead>
          <th>File</th>
          <th></th>
          <th>Statements</th>
          <th>Branches</th>
          <th>Functions</th>
          <th>Lines</th>
        </thead>
        <tbody>
          <tr p="x-2 y-1" border-rounded cursor-pointer hover="bg-active">
            <td text-sm truncate font-light p-1>Point.spec.ts</td>
            <td p-2 w-50>
              <div b-1 w="100%" h="100%">
                <div w="30%" h="100%" bg="green-500"></div>
              </div>
            </td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
          </tr>
          <tr p="x-2 y-1" border-rounded cursor-pointer hover="bg-active">
            <td text-sm truncate font-light p-1>Point.spec.ts</td>
            <td p-2 w-50>
              <div b-1 w="100%" h="100%">
                <div w="30%" h="100%" bg="green-500"></div>
              </div>
            </td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
            <td text-sm p-1 text-center>0% (0/20)</td>
          </tr>
        </tbody>
      </table>
    </section>

    <Footer :date="new Date()" />
  </div>
</template>
