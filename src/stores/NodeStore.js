import { defineStore } from 'pinia';

export const useNodeStore = defineStore('NodeStore', {
  state() {
    return {
      nodes: [
        {
          id: 1,
          title: 'My title',
          description: 'My description',
          childNodes: [2, 3],
          parentNode: null,
        },
      ],
    };
  },
});
