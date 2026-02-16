<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import type { FileUploadUploaderEvent } from 'primevue/fileupload';
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';
import type { Node } from '@/types/Node';

const store = useNodeStore();
const { searchQuery, nodes } = storeToRefs(store);

const handleFileUpload = (event: FileUploadUploaderEvent): void => {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>): void => {
    const result = e.target?.result;
    if (typeof result !== 'string') return;

    try {
      const json = JSON.parse(result) as Node[];
      nodes.value = json;
    } catch (error: unknown) {
      console.error('Error parsing JSON:', error);
    }
  };

  reader.readAsText(file);
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
