<script setup>
import Card from 'primevue/card';
import { useNodeStore } from '@/stores/NodeStore';

const store = useNodeStore();
</script>

<template>
  <router-link
    v-for="node in store.nodesList"
    :key="node.uuid"
    :to="`/nodes/${node.uuid}`"
    style="text-decoration: none; color: inherit"
  >
    <Card data-test-node-item>
      <template #title>
        {{ node.title }}
      </template>
      <template #content>
        {{ node.content }}
      </template>
    </Card>
  </router-link>
</template>
