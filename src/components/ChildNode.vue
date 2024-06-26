<script setup>
import { reactive, ref, watch, computed } from 'vue';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import InputText from 'primevue/inputtext';
import { useNodeStore } from '@/stores/NodeStore';

const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
  parentNodeUuid: {
    type: String,
    default: '',
  },
  level: {
    type: Number,
    default: 0,
  },
});

const { findNode, addChildNode, deleteNode, refreshUpdatedAt, enforceNodeTreeConsistency } =
  useNodeStore();
const editing = ref(false);

const node = findNode(props.nodeUuid);
if (node) {
  reactive(node);
  watch(node, () => {
    refreshUpdatedAt(node.uuid);
  });
} else {
  enforceNodeTreeConsistency();
}

const childNodes = computed(() => {
  return node ? node.childNodes : [];
});
</script>

<template>
  <div v-if="node" :style="{ 'margin-left': level * 1 + 'rem' }" data-test-child-node-item>
    <span v-if="editing" class="inline-flex items-center gap-2">
      <InputText
        v-model="node.title"
        autofocus
        data-test-child-node-title
        type="text"
        @blur="editing = false"
        @focusout="editing = false"
        @keydown.enter="editing = false"
        @keydown.esc="editing = false"
      />
    </span>
    <Chip v-else>
      <Checkbox v-model="node.resolved" :binary="true" />
      <div data-test-child-node-title class="chip-title">
        {{ node.title || 'add a title' }}
      </div>
      <div class="chip-actions">
        <Button
          data-test-child-node-edit
          icon="pi pi-pencil"
          text
          raised
          rounded
          aria-label="edit"
          @click="editing = true"
        />
        <router-link :key="node.uuid" :to="`/nodes/${node.uuid}`">
          <Button
            data-test-child-node-show
            icon="pi pi-search-plus"
            text
            raised
            rounded
            aria-label="show node"
          />
        </router-link>
        <Button
          data-test-child-node-add-child-node
          icon="pi pi-plus"
          text
          raised
          rounded
          aria-label="add child node"
          @click="addChildNode(nodeUuid)"
        />
        <Button
          data-test-child-node-delete
          icon="pi pi-times"
          text
          raised
          rounded
          aria-label="add child node"
          @click="deleteNode(nodeUuid)"
        />
      </div>
    </Chip>
  </div>
  <ChildNode
    v-for="childNodeUuid in childNodes"
    :key="childNodeUuid"
    :node-uuid="childNodeUuid"
    :parent-node-uuid="node.uuid"
    :level="level + 1"
  />
</template>

<style>
.chip-title {
  margin: 0rem 1rem 0rem 1rem;
}
.chip-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
