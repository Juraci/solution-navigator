<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <div class="side-panel">
    <router-link
      v-for="node in store.nodesList"
      :key="node.uuid"
      :to="`/nodes/${node.uuid}`"
      style="text-decoration: none; color: inherit;"
    >
      <Card data-test-node-item>
        <template #title>{{ node.title }}</template>
        <template #content>{{ node.description }}</template>
      </Card>
    </router-link>
  </div>
</template>

<style scoped>
.side-panel {
  display: flex;
  gap: 10px;
}
</style>
