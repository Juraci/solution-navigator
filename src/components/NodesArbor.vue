<script setup>
import Card from 'primevue/card';
import ScrollPanel from 'primevue/scrollpanel';
import FileUpload from 'primevue/fileupload';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';

const store = useNodeStore();
const { nodesList, nodes, searchQuery } = storeToRefs(store);

const handleFileUpload = (input) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      nodes.value = json;
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  reader.readAsText(input.files[0]);
};
</script>

<template>
  <ScrollPanel style="height: 94vh">
    <div class="side-panel-content">
      <router-link
        v-for="node in nodesList"
        :key="node.uuid"
        :to="`/nodes/${node.uuid}`"
        style="text-decoration: none; color: inherit"
      >
        <Card data-test-node-item>
          <template #title>
            <div class="node-card-title">
              {{ node.title }}
            </div>
          </template>
          <template #content>
            <div class="node-card-content">
              {{ node.content }}
            </div>
          </template>
        </Card>
      </router-link>
      <div
        v-if="searchQuery !== '' && nodesList.length === 0"
        class="no-results"
        data-test-search-no-results
      >
        No Results
      </div>
      <FileUpload
        v-show="searchQuery === ''"
        mode="basic"
        accept=".json"
        :max-file-size="1000000"
        :auto="true"
        choose-label="Import existing nodes"
        custom-upload
        @uploader="handleFileUpload"
      />
    </div>
  </ScrollPanel>
</template>

<style>
.no-results {
  display: flex;
  justify-content: center;
  margin-top: 100%;
  color: #a1a1aa;
}
.side-panel-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.node-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
}
.node-card-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #a1a1aa;
}
</style>
