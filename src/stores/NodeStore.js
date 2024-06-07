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
    title = '',
    content = '',
    resolved = false,
    childNodes = [],
    parentNode = null,
    pomodoroCount = 0,
  } = {}) => {
    const uuid = uuidv4();

    nodes.value.push({
      uuid,
      title,
      content,
      resolved,
      childNodes,
      parentNode,
      pomodoroCount,
    });

    return uuid;
  };

  const findNode = (uuid) => nodes.value.find((node) => node.uuid === uuid);

  const addTitleToNode = ({ uuid, title }) => {
    const node = findNode(uuid);
    if (!node) return;

    node.title = title;
  };

  const addContentToNode = ({ uuid, content }) => {
    const node = findNode(uuid);
    if (!node) return;

    node.content = content;
  };

  return { nodes, nodesList, addNode, findNode, addTitleToNode, addContentToNode };
});
