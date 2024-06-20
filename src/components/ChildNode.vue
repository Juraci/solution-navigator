<script setup>
import { reactive, ref } from 'vue';
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
});

const { findNode } = useNodeStore();
const editing = ref(false);
const checked = ref(false);

const node = findNode(props.nodeUuid);
reactive(node);
</script>

<template>
  <div data-test-child-node-item>
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
      <Checkbox v-model="checked" :binary="true" />
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
      </div>
    </Chip>
  </div>
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
