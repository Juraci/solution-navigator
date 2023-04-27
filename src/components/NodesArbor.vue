<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <Card v-for="node in store.nodesList" :key="node.uuid">
    <template #title>{{ node.title }}</template>
    <template #content>{{ node.description }}</template>
  </Card>
</template>

<style scoped></style>
