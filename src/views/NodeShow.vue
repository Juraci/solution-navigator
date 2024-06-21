<script setup>
import Button from 'primevue/button';
import { ref, reactive, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Divider from 'primevue/divider';
import { useNodeStore } from '@/stores/NodeStore';
import ChildNode from '@/components/ChildNode.vue';

const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['delete', 'nodeNotFound']);

const { findNode, refreshUpdatedAt, addChildNode } = useNodeStore();
const editingTitle = ref(false);
const editingContent = ref(false);
const titlePlaceHolder = ref('add a title...');
const contentPlaceholder = ref('double click to add content or edit it...');

const node = findNode(props.nodeUuid);

if (node) {
  reactive(node);

  watch(node, () => {
    refreshUpdatedAt(node.uuid);
  });
} else {
  emit('nodeNotFound');
}
</script>

<template>
  <div v-if="node" class="active-node">
    <div class="active-node-panel-header">
      <Button
        data-test-node-delete
        icon="pi pi-trash"
        aria-label="Delete Node"
        severity="secondary"
        @click="emit('delete', node.uuid)"
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
      @keydown.esc="editingTitle = false"
    />
    <div v-else data-test-node-title @click="editingTitle = true">
      {{ node.title || titlePlaceHolder }}
    </div>
    <Divider />
    <Textarea
      v-if="editingContent"
      v-model="node.content"
      data-test-node-content
      tabindex="0"
      rows="20"
      autofocus
      @blur="editingContent = false"
      @focusout="editingContent = false"
      @keydown.esc="editingContent = false"
    />
    <div v-else data-test-node-content class="final-content" @dblclick="editingContent = true">
      {{ node.content || contentPlaceholder }}
    </div>
    <Divider />
    <div class="child-nodes-actions">
      <Button
        data-test-node-add-child-node
        label="Add child node"
        icon="pi pi-plus-circle"
        severity="secondary"
        aria-label="Add child node"
        rounded
        @click="addChildNode(node.uuid)"
      />
    </div>
    <ChildNode
      v-for="childNodeUuid in node.childNodes"
      :key="childNodeUuid"
      :node-uuid="childNodeUuid"
      :parent-node-uuid="node.uuid"
      :level="0"
    />
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
  min-height: 400px;
  max-height: 400px;
  height: 100%;
  overflow: auto;
}
.active-node-panel-header {
  display: flex;
  justify-content: flex-end;
}
.child-nodes-actions {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
