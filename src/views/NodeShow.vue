<script setup>
import markdownit from 'markdown-it';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { ref, watch, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Divider from 'primevue/divider';
import ScrollPanel from 'primevue/scrollpanel';
import OverlayBadge from 'primevue/overlaybadge';
import { useNodeStore } from '@/stores/NodeStore';
import { usePomodoro } from '@/composables/usePomodoro';
import ChildNode from '@/components/ChildNode.vue';

const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['delete', 'nodeNotFound', 'toggleExpand', 'togglePomodoroPanel']);

const { findNode, refreshUpdatedAt, addChildNode, getRootNode, getPomodoroCount } = useNodeStore();
const { timerDisplay, isRunning, phaseName } = usePomodoro();
const editingTitle = ref(false);
const editingContent = ref(false);
const titlePlaceHolder = ref('add a title...');
const nodeTitle = ref('');
const nodeContent = ref('');
const contentPlaceholder = ref('double click to add content or edit it...');
const md = markdownit({ html: true, linkify: true, typographer: true });

const node = findNode(props.nodeUuid);

if (!node) {
  emit('nodeNotFound');
} else {
  nodeTitle.value = node.title;
  nodeContent.value = node.content;

  watch(nodeTitle, (newValue) => {
    node.title = newValue;
    refreshUpdatedAt(node.uuid);
  });

  watch(nodeContent, (newValue) => {
    node.content = newValue;
    refreshUpdatedAt(node.uuid);
  });
}

const rootNodeAddress = computed(() => {
  return `/nodes/${getRootNode(props.nodeUuid).uuid}`;
});

const getPomodoroSeverity = computed(() => {
  if (phaseName.value === 'Work') return 'danger';
  return 'success';
});

const handleAddChildNode = () => {
  addChildNode(props.nodeUuid);
  refreshUpdatedAt(props.nodeUuid);
};
</script>

<template>
  <div v-if="node" class="active-node">
    <div class="active-node-panel-header">
      <Button
        data-test-node-expand
        class="expand-button"
        icon="pi pi-arrows-h"
        aria-label="Expand"
        severity="secondary"
        @click="emit('toggleExpand')"
      />
      <OverlayBadge
        v-if="isRunning"
        class="pomodoro-badge"
        :value="timerDisplay"
        :severity="getPomodoroSeverity"
      >
        <Button
          data-test-show-pomodoro-panel
          class="pomodoro-button"
          icon="pi pi-clock"
          aria-label="Show Pomodoro Panel"
          severity="secondary"
          @click="emit('togglePomodoroPanel', node.uuid)"
        />
      </OverlayBadge>
      <Button
        v-else
        data-test-show-pomodoro-panel
        class="pomodoro-button"
        icon="pi pi-clock"
        aria-label="Show Pomodoro Panel"
        severity="secondary"
        @click="emit('togglePomodoroPanel', node.uuid)"
      />
      <Button
        data-test-node-delete
        icon="pi pi-trash"
        aria-label="Delete Node"
        severity="secondary"
        @click="emit('delete', node.uuid)"
      />
    </div>
    <ScrollPanel style="width: auto; height: 94vh">
      <div class="active-node-content">
        <InputText
          v-if="editingTitle"
          v-model="nodeTitle"
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
          v-model="nodeContent"
          data-test-node-content
          tabindex="0"
          rows="20"
          autofocus
          @blur="editingContent = false"
          @focusout="editingContent = false"
          @keydown.esc="editingContent = false"
        />
        <ScrollPanel v-else style="width: auto; height: 400px">
          <div
            data-test-node-content
            class="final-content"
            @dblclick="editingContent = true"
            v-html="md.render(node.content) || contentPlaceholder"
          ></div>
        </ScrollPanel>
        <Divider />
        <div class="child-nodes-actions">
          <Button
            data-test-node-add-child-node
            label="Add child node"
            icon="pi pi-plus-circle"
            severity="secondary"
            aria-label="Add child node"
            rounded
            @click="handleAddChildNode"
          />
          <Button
            v-if="node.parentNode"
            data-test-node-go-back-to-root
            label="Back to root node"
            icon="pi pi-arrow-left"
            as="router-link"
            :to="rootNodeAddress"
            severity="secondary"
            aria-label="Back to root node"
            rounded
          />
          <span class="pomodoro-text"> Pomodoros: </span>
          <Badge
            data-test-node-total-pomodoro
            class="pomodoro-badge"
            :value="getPomodoroCount(node.uuid)"
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
    </ScrollPanel>
  </div>
</template>

<style>
.active-node {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.active-node-panel-header {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.active-node-content {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pomodoro-text {
  margin-top: 0.5rem;
}
.pomodoro-badge {
  margin-top: 0.25rem;
}
.final-content {
  white-space: pre-wrap;
}
.p-textarea {
  min-height: 400px;
}
.pomodoro-button {
  margin-right: auto;
}
.pomodoro-badge {
  margin-right: auto;
}
.child-nodes-actions {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>
