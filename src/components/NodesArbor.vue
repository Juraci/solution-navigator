<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <div class="side-panel">
    <Card data-test-node-item v-for="node in store.nodesList" :key="node.uuid">
      <template #title>{{ node.title }}</template>
      <template #content>{{ node.description }}</template>
    </Card>
  </div>
</template>

<style scoped>
.side-panel {
  display: flex;
  gap: 10px;
}
</style>
