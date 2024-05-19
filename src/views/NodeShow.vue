<script setup>
const props = defineProps({
  nodeUuid: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div>
    <header>Some sample title {{ nodeUuid }}</header>
    <p>Some sample content</p>
  </div>
</template>

<style scoped></style>