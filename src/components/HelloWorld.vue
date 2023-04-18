<script setup>
import InputText from 'primevue/inputtext';

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
    <span class="p-float-label">
      <InputText id="username" v-model="username" @input="onInput" />
      <label for="username">Username</label>
    </span>
  </div>
</template>

<style scoped></style>
