<script setup>
import Button from 'primevue/button';
import NodesArbor from '@/components/NodesArbor.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useRouter, useRoute } from 'vue-router';
import { useNodeStore } from '@/stores/NodeStore';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const route = useRoute();
const store = useNodeStore();
const confirm = useConfirm();

const addNode = () => {
  const uuid = store.addNode();
  router.push({ name: 'node.show', params: { uuid } });
};

const deleteConfirmation = (nodeUuid) => {
  const accept = () => {
    console.log(`>>>> accepted ${nodeUuid} <<<<<`);
  };
  confirm.require({
    header: 'Delete Confirmation',
    message: 'Are you sure you want to delete this node?',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    position: 'topright',
    accept,
    reject: () => console.log('>>>> rejected <<<<<'),
  });
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
      <router-view ref="active-node" :key="route.path" @delete="deleteConfirmation" />
    </div>
    <ConfirmDialog />
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
