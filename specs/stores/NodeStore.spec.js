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

  describe('addNode', () => {
    it('adds nodes', () => {
      const nodeStore = useNodeStore();

      expect(nodeStore.nodes.length).toBe(0);
      const uuid = nodeStore.addNode({
        title: '',
        content: 'my content',
        resolved: false,
        childNodes: [],
        pomodoroCount: 0,
      });

      expect(nodeStore.nodes.length).toBe(1);
      const node = nodeStore.nodes[0];
      expect(uuid).toEqual(node.uuid);
      expect(node).toHaveProperty('title', '');
      expect(node).toHaveProperty('content', 'my content');
      expect(node).toHaveProperty('resolved', false);
      expect(node).toHaveProperty('childNodes', []);
      expect(node).toHaveProperty('pomodoroCount', 0);
    });

    it('adds a default empty node when no object is passed', () => {
      const nodeStore = useNodeStore();

      const uuid = nodeStore.addNode();

      const node = nodeStore.nodes[0];
      expect(uuid).toEqual(node.uuid);
      expect(node).toHaveProperty('title', '');
      expect(node).toHaveProperty('content', '');
      expect(node).toHaveProperty('resolved', false);
      expect(node).toHaveProperty('childNodes', []);
      expect(node).toHaveProperty('pomodoroCount', 0);
    });
  });

  describe('nodesList', () => {
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

  describe('findNode', () => {
    it('finds a node by uuid', () => {
      const nodeStore = useNodeStore();
      const uuid = nodeStore.addNode({
        title: 'example',
        content: 'my content',
        resolved: false,
        childNodes: [],
        pomodoroCount: 0,
      });

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('title', 'example');
    });
  });

  describe('addTitleToNode', () => {
    it('adds a title to a node', () => {
      const nodeStore = useNodeStore();
      const uuid = nodeStore.addNode();

      nodeStore.addTitleToNode({ uuid, title: 'example' });

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('title', 'example');
    });
  });

  describe('addContentToNode', () => {
    it('adds content to a node', () => {
      const nodeStore = useNodeStore();
      const uuid = nodeStore.addNode();

      nodeStore.addContentToNode({ uuid, content: 'my content' });

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('content', 'my content');
    });
  });
});
