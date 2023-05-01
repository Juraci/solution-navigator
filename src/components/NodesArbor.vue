<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <div class="nodes-arbor">
    <Card v-for="node in store.nodesList" :key="node.uuid">
      <template #title>{{ node.title }}</template>
      <template #content>{{ node.description }}</template>
    </Card>
  </div>
</template>

<style scoped></style>
