<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
const nodeTitle = ref('');

const addNode = () => {
  if (nodeTitle.value === '') return;
  store.addNode({ title: nodeTitle.value });
  nodeTitle.value = '';
};
</script>

<template>
  <form @submit.prevent="addNode">
    <div class="p-inputgroup flex-1">
      <InputText data-test-input v-model="nodeTitle" placeholder="Node title" />
      <Button type="submit" data-test-btn label="Add" />
    </div>
  </form>
</template>

<style scoped></style>
