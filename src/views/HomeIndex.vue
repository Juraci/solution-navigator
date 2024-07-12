<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import NodesArbor from '@/components/NodesArbor.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useRouter, useRoute } from 'vue-router';
import { useNodeStore } from '@/stores/NodeStore';
import { useConfirm } from 'primevue/useconfirm';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const isSidePanelVisible = ref(true);
const { addNode, deleteNode } = useNodeStore();
const confirm = useConfirm();
const { nodes } = storeToRefs(useNodeStore());

const handleAddNode = () => {
  const uuid = addNode();
  router.push({ name: 'node.show', params: { uuid } });
};

const deleteConfirmation = (nodeUuid) => {
  const accept = () => {
    router.push({ name: 'nodes.index' });
    deleteNode(nodeUuid);
  };
  confirm.require({
    header: 'Delete Confirmation',
    message: 'Are you sure you want to delete this node?',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    position: 'topright',
    accept,
    reject: () => {},
  });
};

const gridTemplateColumns = computed(() => {
  return isSidePanelVisible.value ? 'minmax(400px, 1fr) 3fr' : '1fr';
});

const handleNodeNotFound = () => {
  router.push({ name: 'node.not-found' });
};

const downloadNodesLink = computed(() => {
  const jsonNodes = JSON.stringify(nodes.value);
  const blob = new Blob([jsonNodes], { type: 'application/json' });

  return URL.createObjectURL(blob);
});
</script>

<template>
  <div class="container" :style="{ 'grid-template-columns': gridTemplateColumns }">
    <div v-show="isSidePanelVisible" class="side-panel">
      <div class="side-panel-header">
        <Button
          icon="pi pi-save"
          aria-label="Save"
          severity="secondary"
          as="a"
          :href="downloadNodesLink"
          :download="`solution-navigator-${new Date().toISOString()}.json`"
        />
        <Button
          data-test-create-node
          icon="pi pi-pen-to-square"
          aria-label="Create Node"
          severity="secondary"
          @click="handleAddNode"
        />
      </div>
      <div class="side-panel-content">
        <NodesArbor />
      </div>
    </div>
    <router-view
      ref="active-node"
      :key="route.path"
      @delete="deleteConfirmation"
      @node-not-found="handleNodeNotFound"
      @toggle-expand="isSidePanelVisible = !isSidePanelVisible"
    />
    <ConfirmDialog />
  </div>
</template>

<style>
.container {
  display: grid;
  grid-column-gap: 10px;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.side-panel-header {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
.side-panel-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  max-height: 94vh;
  overflow: auto;
}
</style>
