<script setup>
import Button from 'primevue/button';
import { ref, toRef } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useNodeStore } from '@/stores/NodeStore';

const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
});

defineEmits(['delete']);

const { findNode } = useNodeStore();
const editingTitle = ref(false);
const editingContent = ref(false);
const titlePlaceHolder = ref('add a title...');
const contentPlaceholder = ref('double click to add content or edit it...');

const node = toRef(findNode(props.nodeUuid));
</script>

<template>
  <div class="active-node">
    <div class="active-node-panel-header">
      <Button
        data-test-node-delete
        icon="pi pi-trash"
        aria-label="Delete Node"
        severity="secondary"
        @click="$emit('delete', node.uuid)"
      />
    </div>
    <InputText
      v-if="editingTitle"
      v-model="node.title"
      autofocus
      data-test-node-title
      type="text"
      @blur="editingTitle = false"
      @focusout="editingTitle = false"
      @keydown.enter="editingTitle = false"
    />
    <div v-else data-test-node-title @click="editingTitle = true">
      {{ node.title || titlePlaceHolder }}
    </div>
    <Textarea
      v-if="editingContent"
      v-model="node.content"
      data-test-node-content
      tabindex="0"
      rows="20"
      autofocus
      @blur="editingContent = false"
      @focusout="editingContent = false"
    />
    <div v-else data-test-node-content class="final-content" @dblclick="editingContent = true">
      {{ node.content || contentPlaceholder }}
    </div>
  </div>
</template>

<style scoped>
.active-node {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.final-content {
  white-space: pre-wrap;
}
.active-node-panel-header {
  display: flex;
  justify-content: flex-end;
}
</style>
