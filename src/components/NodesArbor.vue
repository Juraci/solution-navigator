<script setup>
import Card from 'primevue/card';
import ScrollPanel from 'primevue/scrollpanel';
import NoResults from '@/components/NoResults.vue';
import ImportNodes from '@/components/ImportNodes.vue';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';

const store = useNodeStore();
const { nodesList } = storeToRefs(store);
</script>

<template>
  <ScrollPanel style="height: 94vh">
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
      <NoResults />
      <ImportNodes />
    </div>
  </ScrollPanel>
</template>

<style>
.side-panel-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.node-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
}
.node-card-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #a1a1aa;
}
</style>
