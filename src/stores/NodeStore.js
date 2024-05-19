import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const useNodeStore = defineStore('NodeStore', () => {
  // state
  const nodes = ref([]);

  // getters
  const nodesList = computed(() => nodes.value);

  // actions
  const addNode = ({
    title,
    content = '',
    resolved = false,
    childNodes = [],
    parentNode = null,
    pomodoroCount = 0,
  }) => {
    nodes.value.push({
      uuid: uuidv4(),
      title,
      content,
      resolved,
      childNodes,
      parentNode,
      pomodoroCount,
    });
  };

  return { nodes, nodesList, addNode };
});
