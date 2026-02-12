import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { useNodeStore } from '@/stores/NodeStore';

describe('NodeStore', () => {
  function setupPinia(nodes = []) {
    setActivePinia(
      createTestingPinia({
        initialState: {
          NodeStore: { nodes, searchQuery: '' },
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
    expect(nodeStore.searchQuery).toEqual('');
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
          uuid: '2947d509-ba89-4be5-a6c2-4c6cf546f6ed',
          title: 'example',
          content: 'my content',
          resolved: false,
          parentNode: null,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldNode,
          updatedAt: oldNode,
        },
        {
          uuid: '8881bc3f-7497-4440-9f53-7781b7f6bade',
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          parentNode: null,
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

    it('lists only the root nodes', () => {
      const initialState = [
        {
          uuid: '2947d509-ba89-4be5-a6c2-4c6cf546f6ed',
          title: 'example',
          content: 'my content',
          resolved: false,
          parentNode: null,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: '2022-06-16T21:59:54.858Z',
          updatedAt: '2023-06-16T21:59:54.858Z',
        },
        {
          uuid: '8881bc3f-7497-4440-9f53-7781b7f6bade',
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          parentNode: null,
          childNodes: ['8f4f5ccc-1232-4168-9ed8-b18b8022d7ff'],
          pomodoroCount: 0,
          createdAt: '2022-06-16T21:59:54.858Z',
          updatedAt: '2023-06-16T21:59:54.858Z',
        },
        {
          uuid: '8f4f5ccc-1232-4168-9ed8-b18b8022d7ff',
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          parentNode: '8881bc3f-7497-4440-9f53-7781b7f6bade',
          childNodes: [],
          pomodoroCount: 0,
          createdAt: '2022-06-16T21:59:54.858Z',
          updatedAt: '2023-06-16T21:59:54.858Z',
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      expect(nodeStore.nodesList.length).toBe(2);
      expect(nodeStore.nodesList.map((node) => node.parentNode)).toEqual([null, null]);
    });

    it('filters nodes by search query', () => {
      const oldNode = '2022-06-16T21:59:54.858Z';
      const newNode = '2023-06-16T21:59:54.858Z';

      const initialState = [
        {
          uuid: '2947d509-ba89-4be5-a6c2-4c6cf546f6ed',
          title: 'example',
          content: 'my content',
          resolved: false,
          parentNode: null,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: oldNode,
          updatedAt: oldNode,
        },
        {
          uuid: '8881bc3f-7497-4440-9f53-7781b7f6bade',
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          parentNode: null,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: newNode,
          updatedAt: newNode,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();
      nodeStore.searchQuery = 'my content 2';

      expect(nodeStore.nodesList.length).toBe(1);
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
        uuid: 'a46df82c-eea1-4365-8e4b-9c0d471c2906',
        title: 'example 2',
        content: 'my content 2',
        resolved: false,
        parentNode: '76510564-70dd-4baa-8837-68a3adbea011',
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

  describe('getRootNode', () => {
    it('returns the root node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const childNodeUuid = '370d2e0f-2f8c-4c48-b874-13a88ef65503';
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
          uuid: childNodeUuid,
          title: 'example 2',
          content: 'my content 2',
          resolved: false,
          parentNode: uuid,
          childNodes: [],
          pomodoroCount: 0,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      const rootNode = nodeStore.getRootNode(childNodeUuid);
      expect(rootNode).toHaveProperty('uuid', uuid);
    });
  });

  describe('incrementPomodoro', () => {
    it('increments the pomodoroCount of a node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: '2022-06-16T21:59:54.858Z',
          updatedAt: '2022-06-16T21:59:54.858Z',
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      nodeStore.incrementPomodoro(uuid);

      const node = nodeStore.findNode(uuid);
      expect(node.pomodoroCount).toBe(1);
    });

    it('does nothing if the node does not exist', () => {
      setupPinia();
      const nodeStore = useNodeStore();

      nodeStore.incrementPomodoro('non-existent-uuid');

      expect(nodeStore.nodes.length).toBe(0);
    });
  });

  describe('getPomodoroCount', () => {
    it('returns the pomodoro count for a single node', () => {
      const uuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const initialState = [
        {
          uuid,
          title: 'example',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 3,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      expect(nodeStore.getPomodoroCount(uuid)).toBe(3);
    });

    it('returns the sum of pomodoro counts for the entire node tree', () => {
      const rootUuid = '6f156d33-cc51-4f30-8e99-5f006842150d';
      const childUuid = '370d2e0f-2f8c-4c48-b874-13a88ef65503';
      const grandchildUuid = 'a46df82c-eea1-4365-8e4b-9c0d471c2906';
      const initialState = [
        {
          uuid: rootUuid,
          title: 'root',
          content: '',
          resolved: false,
          childNodes: [childUuid],
          pomodoroCount: 3,
        },
        {
          uuid: childUuid,
          title: 'child',
          content: '',
          resolved: false,
          parentNode: rootUuid,
          childNodes: [grandchildUuid],
          pomodoroCount: 2,
        },
        {
          uuid: grandchildUuid,
          title: 'grandchild',
          content: '',
          resolved: false,
          parentNode: childUuid,
          childNodes: [],
          pomodoroCount: 1,
        },
      ];

      setupPinia(initialState);
      const nodeStore = useNodeStore();

      expect(nodeStore.getPomodoroCount(rootUuid)).toBe(6);
    });

    it('returns 0 if the node does not exist', () => {
      setupPinia();
      const nodeStore = useNodeStore();

      expect(nodeStore.getPomodoroCount('non-existent-uuid')).toBe(0);
    });
  });
});
