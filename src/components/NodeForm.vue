<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useNodeStore } from '@/stores/NodeStore';

const nodeStore = useNodeStore();
const nodeTitle = ref('');

const addNode = () => {
  if (nodeTitle.value === '') return;
  nodeStore.addNode({ title: nodeTitle.value });
};
</script>

<template>
  <form @submit.prevent="addNode">
    <div class="p-inputgroup flex-1">
      <InputText data-test-input v-model="nodeTitle" placeholder="Brief title" />
      <Button type="submit" data-test-btn label="Add" />
    </div>
  </form>
</template>

<style scoped></style>
