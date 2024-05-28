<script setup>
import { ref, toRef } from 'vue';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useNodeStore } from '@/stores/NodeStore';

const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
});

const store = useNodeStore();

const { findNode, addTitleToNode } = store;
const node = toRef(findNode(props.nodeUuid));
const title = ref('');
</script>

<template>
  <div>
    <p v-if="node.title">{{ node.title }}</p>
    <form v-else @submit.prevent="addTitleToNode({ uuid: nodeUuid, title })">
      <InputGroup>
        <InputText v-model="title" data-test-node-title placeholder="Title" />
        <Button data-test-node-title-save icon="pi pi-check" severity="secondary" type="submit" />
      </InputGroup>
    </form>
    <Textarea v-model="node.content" data-test-node-content rows="40" cols="60" />
  </div>
</template>

<style scoped></style>
