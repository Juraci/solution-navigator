import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNodeStore } from '@/stores/NodeStore';

describe('NodeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with correct values', () => {
    const nodeStore = useNodeStore();
    expect(nodeStore.nodes.length).toBe(0);
  });

  it('adds nodes', () => {
    const nodeStore = useNodeStore();

    expect(nodeStore.nodes.length).toBe(0);
    nodeStore.addNode({
      title: 'example',
      content: 'my content',
      resolved: false,
      childNodes: [],
      pomodoroCount: 0,
    });

    expect(nodeStore.nodes.length).toBe(1);
    const node = nodeStore.nodes[0];
    expect(node.uuid).not.toBeUndefined();
    expect(node).toHaveProperty('title', 'example');
    expect(node).toHaveProperty('content', 'my content');
    expect(node).toHaveProperty('resolved', false);
    expect(node).toHaveProperty('childNodes', []);
    expect(node).toHaveProperty('pomodoroCount', 0);
  });

  it('lists nodes', () => {
    const nodeStore = useNodeStore();
    nodeStore.addNode({
      title: 'example',
      content: 'my content',
      resolved: false,
      childNodes: [],
      pomodoroCount: 0,
    });

    expect(nodeStore.nodesList.length).toBe(1);
    const node = nodeStore.nodesList[0];
    expect(node).toHaveProperty('title', 'example');
  });
});
