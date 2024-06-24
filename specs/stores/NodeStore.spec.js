import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { useNodeStore } from '@/stores/NodeStore';

describe('NodeStore', () => {
  function setupPinia(nodes = []) {
    setActivePinia(
      createTestingPinia({
        initialState: {
          NodeStore: { nodes },
        },
        createSpy: vi.fn,
        stubActions: false,
      }),
    );
  }

  it('initializes with correct values', () => {
    setupPinia();
    const nodeStore = useNodeStore();
    expect(nodeStore.nodes.length).toBe(0);
  });

  describe('addNode', () => {
    it('adds nodes', () => {
      setupPinia();
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
      expect(node).toHaveProperty('createdAt');
      expect(node).toHaveProperty('updatedAt');
    });

    it('adds a default empty node when no object is passed', () => {
      setupPinia();
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
    it('lists nodes ordered by updatedAt', () => {
      const oldNode = '2022-06-16T21:59:54.858Z';
      const newNode = '2023-06-16T21:59:54.858Z';

      const initialState = [
        {
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldNode,
          updatedAt: oldNode,
        },
        {
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: newNode,
          updatedAt: newNode,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      expect(nodeStore.nodesList.length).toBe(2);
      const firstNode = nodeStore.nodesList[0];
      expect(firstNode).toHaveProperty('updatedAt', newNode);
      const secondNode = nodeStore.nodesList[1];
      expect(secondNode).toHaveProperty('updatedAt', oldNode);
    });
  });

  describe('findNode', () => {
    it('finds a node by uuid', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
        },
      ];
      setupPinia(initialState);
      const nodeStore = useNodeStore();

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('title', 'example');
    });
  });

  describe('addTitleToNode', () => {
    it('adds a title to a node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const oldDate = '2020-06-16T21:59:54.858Z';

      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      ];
      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.addTitleToNode({ uuid, title: 'example' });

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('title', 'example');
      expect(Date.parse(node.updatedAt)).toBeGreaterThan(Date.parse(oldDate));
    });
  });

  describe('addContentToNode', () => {
    it('adds content to a node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const oldDate = '2020-06-16T21:59:54.858Z';
      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.addContentToNode({ uuid, content: 'my content' });

      const node = nodeStore.findNode(uuid);
      expect(node).toHaveProperty('content', 'my content');
      expect(Date.parse(node.updatedAt)).toBeGreaterThan(Date.parse(oldDate));
    });
  });

  describe('deleteNode', () => {
    const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
    const parentNodeUuid = '370d2e0f-2f8c-4c48-b874-13a88ef65503';
    const nodeUuidToDelete = '67aa7e46-1a7c-4f03-8f19-04dc20ba0a95';
    const initialState = [
      {
        uuid,
        title: 'example',
        content: 'my content',
        resolved: false,
        childNodes: ['370d2e0f-2f8c-4c48-b874-13a88ef65503'],
        pomodoroCount: 0,
      },
      {
        uuid: parentNodeUuid,
        title: 'example 2',
        content: 'my content 2',
        resolved: false,
        parentNode: uuid,
        childNodes: [
          '67aa7e46-1a7c-4f03-8f19-04dc20ba0a95',
          'a46df82c-eea1-4365-8e4b-9c0d471c2906',
        ],
        pomodoroCount: 0,
      },
      {
        uuid: nodeUuidToDelete,
        title: 'example 2',
        content: 'my content 2',
        resolved: false,
        parentNode: parentNodeUuid,
        childNodes: [],
        pomodoroCount: 0,
      },
      {
        uuid: 'a46df82c-eea1-4365-8e4b-9c0d471c2906',
        title: 'example 2',
        content: 'my content 2',
        resolved: false,
        parentNode: parentNodeUuid,
        childNodes: [],
        pomodoroCount: 0,
      },
    ];

    it('deletes a node and all its children', () => {
      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.deleteNode(uuid);

      expect(nodeStore.nodes.length).toBe(0);
    });

    describe('when the node has a parent node', () => {
      it('removes itself from the parent node before deleting', () => {
        setupPinia(initialState);
        const nodeStore = useNodeStore();

        nodeStore.deleteNode(nodeUuidToDelete);

        expect(nodeStore.nodes.length).toBe(3);

        const node = nodeStore.findNode(parentNodeUuid);
        expect(node.childNodes).not.toContain(nodeUuidToDelete);
      });
    });
  });

  describe('refreshUpdatedAt', () => {
    it('updates the updatedAt property of a node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const oldDate = '2020-06-16T21:59:54.858Z';

      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.refreshUpdatedAt(uuid);

      const node = nodeStore.findNode(uuid);
      expect(Date.parse(node.updatedAt)).toBeGreaterThan(Date.parse(oldDate));
    });
  });

  describe('addChildNode', () => {
    it('adds a child node to a parent node', () => {
      const parentNodeUuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const initialState = [
        {
          uuid: parentNodeUuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      const childNodeUuid = nodeStore.addChildNode(parentNodeUuid);

      const node = nodeStore.findNode(parentNodeUuid);
      expect(node).toHaveProperty('childNodes', [childNodeUuid]);

      const childNode = nodeStore.findNode(childNodeUuid);
      expect(childNode).toHaveProperty('parentNode', parentNodeUuid);
    });

    it('does nothing if the parent node does not exist', () => {
      const parentNodeUuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const initialState = [];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.addChildNode(parentNodeUuid);

      expect(nodeStore.nodes.length).toBe(0);
    });
  });

  describe('enforceNodeTreeConsistency', () => {
    const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
    const missingChildNodeUuid = '370d2e0f-2f8c-4c48-b874-13a88ef65503';
    const missingParentNodeUuid = '76510564-70dd-4baa-8837-68a3adbea011';
    const initialState = [
      {
        uuid,
        title: 'example',
        content: 'my content',
        resolved: false,
        childNodes: [missingChildNodeUuid],
        pomodoroCount: 0,
      },
      {
        uuid: 'a46df82c-eea1-4365-8e4b-9c0d471c2906',
        title: 'example 2',
        content: 'my content 2',
        resolved: false,
        parentNode: missingParentNodeUuid,
        childNodes: [],
        pomodoroCount: 0,
      },
    ];

    it('checks for broken node references and removes them from the store', () => {
      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.enforceNodeTreeConsistency();

      expect(nodeStore.nodes.length).toBe(2);

      expect(nodeStore.nodes[0]).toHaveProperty('childNodes', []);
      expect(nodeStore.nodes[1]).toHaveProperty('parentNode', null);
    });
  });
});
