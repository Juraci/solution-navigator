<script setup>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref, watchEffect, computed } from 'vue';
import { useNodeStore } from '@/stores/NodeStore';

const nodeStore = useNodeStore();
const username = ref('');

watchEffect(() => {
  console.log(`>>>> ${username.value}`);
});

const labelText = computed(() => {
  return `Hello ${username.value}`;
});

const onInput = (event) => console.log(`my value is ${event.target.value}`);

defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <span class="node" v-for="node in nodeStore.nodesList" :key="node.id">{{ node.title }}</span>
    <span class="p-float-label">
      <InputText id="freeText" v-model="username" @input="onInput" />
      <label for="freeText">FreeText</label>
    </span>
    <Button label="Add" @click="nodeStore.increment()" />
  </div>
</template>

<style scoped></style>
