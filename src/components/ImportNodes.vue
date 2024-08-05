<script setup>
import FileUpload from 'primevue/fileupload';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';

const store = useNodeStore();
const { searchQuery, nodes } = storeToRefs(store);

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
</template>
