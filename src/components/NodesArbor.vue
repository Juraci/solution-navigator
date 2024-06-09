<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <router-link
    v-for="node in store.nodesList"
    :key="node.uuid"
    :to="`/nodes/${node.uuid}`"
    style="text-decoration: none; color: inherit"
  >
    <Card data-test-node-item>
      <template #title>
        <div class="node-card-title">
          {{ node.title }}
        </div>
      </template>
      <template #content>
        <div class="node-card-content">
          {{ node.content }}
        </div>
      </template>
    </Card>
  </router-link>
</template>

<style scoped>
.node-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node-card-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #a1a1aa;
}
</style>
