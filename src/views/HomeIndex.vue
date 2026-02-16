<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute, type Router, type RouteLocationNormalizedLoaded } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
import Drawer from 'primevue/drawer';
import { useNodeStore } from '@/stores/NodeStore';
import NodesArbor from '@/components/NodesArbor.vue';
import SidePanelHeader from '@/components/SidePanelHeader.vue';
import PomodoroTimer from '@/components/PomodoroTimer.vue';

interface ConfirmationOptions {
  header: string;
  message: string;
  acceptLabel: string;
  rejectLabel: string;
  position: string;
  accept: () => void;
  reject: () => void;
}

const router: Router = useRouter();
const route: RouteLocationNormalizedLoaded = useRoute();
const isSidePanelVisible = ref<boolean>(true);
const isPomodoroPanelVisible = ref<boolean>(false);
const { deleteNode } = useNodeStore();
const confirm = useConfirm();

const deleteConfirmation = (nodeUuid: string): void => {
  const accept = (): void => {
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
    reject: (): void => {},
  } as ConfirmationOptions);
};

const gridTemplateColumns = computed<string>(() => {
  return isSidePanelVisible.value ? 'minmax(400px, 1fr) 3fr' : '1fr';
});

const handleNodeNotFound = (): void => {
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
      @toggle-pomodoro-panel="isPomodoroPanelVisible = !isPomodoroPanelVisible"
    />
    <ConfirmDialog />
  </div>
  <Drawer v-model:visible="isPomodoroPanelVisible" header="Pomodoro" position="right">
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
