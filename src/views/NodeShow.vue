<script setup>
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

const store = useNodeStore();
const editingTitle = ref(false);
const editingContent = ref(false);
const titlePlaceHolder = ref('add a title...');
const contentPlaceholder = ref('double click to add content or edit it...');

const { findNode } = store;
const node = toRef(findNode(props.nodeUuid));
</script>

<template>
  <div class="active-node">
    <InputText
      v-if="editingTitle"
      v-model="node.title"
      data-test-node-title
      type="text"
      @blur="editingTitle = false"
      @focusout="editingTitle = false"
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
</style>
