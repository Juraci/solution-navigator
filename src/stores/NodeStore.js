import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const useNodeStore = defineStore('NodeStore', () => {
  // state
  const nodes = ref([]);

  // getters
  const nodesList = computed(() => {
    return nodes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  });

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
    const now = new Date().toISOString();

    nodes.value.push({
      uuid,
      title,
      content,
      resolved,
      childNodes,
      parentNode,
      pomodoroCount,
      createdAt: now,
      updatedAt: now,
    });

    return uuid;
  };

  const addChildNode = (parentNodeUuid) => {
    const parentNode = findNode(parentNodeUuid);

    if (!parentNode) return;
    const childUuid = addNode({ parentNode: parentNode.uuid });
    parentNode.childNodes.push(childUuid);

    return childUuid;
  };

  const findNode = (uuid) => nodes.value.find((node) => node.uuid === uuid);

  const addTitleToNode = ({ uuid, title }) => {
    const node = findNode(uuid);
    if (!node) return;

    node.title = title;
    node.updatedAt = new Date().toISOString();
  };

  const addContentToNode = ({ uuid, content }) => {
    const node = findNode(uuid);
    if (!node) return;

    node.content = content;
    node.updatedAt = new Date().toISOString();
  };

  const deleteNode = (uuid) => {
    const node = findNode(uuid);

    if (node.childNodes.length > 0) {
      node.childNodes.forEach((childUuid) => {
        deleteNode(childUuid);
      });
    }

    nodes.value = nodes.value.filter((n) => n.uuid !== uuid);
  };

  const refreshUpdatedAt = (uuid) => {
    const node = findNode(uuid);
    if (!node) return;

    node.updatedAt = new Date().toISOString();
  };

  return {
    nodes,
    nodesList,
    addNode,
    addChildNode,
    findNode,
    addTitleToNode,
    addContentToNode,
    deleteNode,
    refreshUpdatedAt,
  };
});
