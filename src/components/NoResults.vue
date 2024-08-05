<script setup>
import { useNodeStore } from '@/stores/NodeStore';
import { storeToRefs } from 'pinia';

const store = useNodeStore();
const { nodesList, searchQuery } = storeToRefs(store);
</script>

<template>
  <div
    v-if="searchQuery !== '' && nodesList.length === 0"
    class="no-results"
    data-test-search-no-results
  >
    No Results
  </div>
</template>

<style>
.no-results {
  display: flex;
  justify-content: center;
  margin-top: 100%;
  color: #a1a1aa;
}
</style>
