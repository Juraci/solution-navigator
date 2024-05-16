<script setup>
import NodeForm from '@/components/NodeForm.vue';
import NodesArbor from '@/components/NodesArbor.vue';
</script>

<template>
  <div class="container">
    <div class="side-panel">
      <NodeForm />
      <NodesArbor />
    </div>
    <div class="active-card">
      <div>
        <header>Some sample title</header>
        <p>Some sample content</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 10px;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
