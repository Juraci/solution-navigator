<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';

const { addNode } = useNodeStore();
const { nodes, searchQuery } = storeToRefs(useNodeStore());

const router = useRouter();

const handleAddNode = () => {
  const uuid = addNode();
  router.push({ name: 'node.show', params: { uuid } });
};

const downloadNodesLink = computed(() => {
  const jsonNodes = JSON.stringify(nodes.value);
  const blob = new Blob([jsonNodes], { type: 'application/json' });

  return URL.createObjectURL(blob);
});
</script>

<template>
  <div class="side-panel-header">
    <InputGroup>
      <InputText
        v-model="searchQuery"
        data-test-search-input
        class="search-input"
        placeholder="Search"
        type="text"
        @keydown.esc="searchQuery = ''"
      />
      <Button icon="pi pi-times" severity="secondary" @click="searchQuery = ''" />
    </InputGroup>
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
</template>

<style>
.side-panel-header {
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
}
.search-input {
  flex-grow: 1;
}
</style>
