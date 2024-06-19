<script setup></script>

<template>
  <div class="node-not-found">
    <div class="not-found-icon">
      <i class="pi pi-exclamation-triangle" style="font-size: 3rem" />
    </div>
    <div class="not-found-message" data-test-node-not-found-message>Node not found</div>
  </div>
</template>

<style>
.node-not-found {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.not-found-icon {
  margin-top: 30%;
  color: #a1a1aa;
}
.not-found-message {
  color: #a1a1aa;
}
</style>
