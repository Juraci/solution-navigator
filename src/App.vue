<script setup>
import NodeForm from '@/components/NodeForm.vue';
import NodesArbor from '@/components/NodesArbor.vue';
</script>

<template>
  <div class="container">
    <NodeForm />
    <NodesArbor />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
