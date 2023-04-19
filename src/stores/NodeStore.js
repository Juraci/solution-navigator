import { defineStore } from 'pinia';

export const useNodeStore = defineStore('NodeStore', {
  state: () => ({ nodes: [], counter: 0 }),
  getters: {
    nodesList() {
      return this.nodes;
    },
  },
  actions: {
    increment() {
      this.counter++;
      this.nodes.push({ title: `Item ${this.counter}` });
    },
  },
});
