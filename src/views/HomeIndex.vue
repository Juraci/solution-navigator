<script setup>
import Button from 'primevue/button';
import NodesArbor from '@/components/NodesArbor.vue';
import { useRouter, useRoute } from 'vue-router';
import { useNodeStore } from '@/stores/NodeStore';

const router = useRouter();
const route = useRoute();
const store = useNodeStore();

const addNode = () => {
  const uuid = store.addNode();
  router.push({ name: 'node.show', params: { uuid } });
};
</script>

<template>
  <div class="container">
    <div class="side-panel">
      <div class="side-panel-header">
        <Button
          data-test-create-node
          icon="pi pi-pen-to-square"
          aria-label="Create Node"
          severity="secondary"
          @click="addNode"
        />
      </div>
      <NodesArbor />
    </div>
    <div class="active-card">
      <router-view :key="route.path" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: minmax(400px, 1fr) 3fr;
  grid-column-gap: 10px;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.side-panel-header {
  display: flex;
  justify-content: flex-end;
}
</style>
