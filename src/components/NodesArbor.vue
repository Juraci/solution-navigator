<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <div class="nodes-arbor">
    <Card data-test-node-item v-for="node in store.nodesList" :key="node.uuid">
      <template #title>{{ node.title }}</template>
      <template #content>{{ node.description }}</template>
    </Card>
  </div>
</template>

<style scoped>
.nodes-arbor {
  margin-top: 30px;
  min-width: 600px;
}
</style>
