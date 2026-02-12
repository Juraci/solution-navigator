<script setup>
import { ref, computed } from 'vue';
import NodesArbor from '@/components/NodesArbor.vue';
import SidePanelHeader from '@/components/SidePanelHeader.vue';
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Drawer from 'primevue/drawer';
import { useRouter, useRoute } from 'vue-router';
import { useNodeStore } from '@/stores/NodeStore';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const route = useRoute();
const isSidePanelVisible = ref(true);
const isPomodoroPanelVisible = ref(false);
const { deleteNode } = useNodeStore();
const confirm = useConfirm();

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
</script>

<template>
  <div class="container" :style="{ 'grid-template-columns': gridTemplateColumns }">
    <div v-show="isSidePanelVisible" class="side-panel">
      <SidePanelHeader />
      <NodesArbor />
    </div>
    <router-view
      ref="active-node"
      :key="route.path"
      @delete="deleteConfirmation"
      @node-not-found="handleNodeNotFound"
      @toggle-expand="isSidePanelVisible = !isSidePanelVisible"
      @togglePomodoroPanel="isPomodoroPanelVisible = !isPomodoroPanelVisible"
    />
    <ConfirmDialog />
  </div>
  <Drawer v-model:visible="isPomodoroPanelVisible" header="Pomodoro Panel" position="right">
    <PomodoroTimer />
  </Drawer>
</template>

<style>
.container {
  display: grid;
  grid-column-gap: 0.5rem;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
