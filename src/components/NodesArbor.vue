<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';

const store = useNodeStore();
const { nodesList } = storeToRefs(store);
</script>

<template>
  <div class="side-panel-content">
    <router-link
      v-for="node in nodesList"
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
  </div>
</template>

<style>
.side-panel-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  max-height: 94vh;
  overflow: auto;
}
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
