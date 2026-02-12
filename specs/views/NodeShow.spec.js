import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import NodeShow from '@/views/NodeShow.vue';
import { createTestingPinia } from '@pinia/testing';
import PrimeVue from 'primevue/config';

describe('NodeShow', () => {
  let node = {
    uuid: '354c62c5-feb1-41a8-828d-4e895ce43886',
    title: 'example',
    content: 'my content',
    resolved: false,
    childNodes: [],
    pomodoroCount: 0,
  };

  function createWrapper(nodes = [node]) {
    return mount(NodeShow, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              NodeStore: { nodes },
            },
            createSpy: vi.fn,
            stubActions: false,
          }),
          PrimeVue,
        ],
      },
      props: {
        nodeUuid: node.uuid,
      },
    });
  }

  it('renders an existing node', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('[data-test-node-title]').exists()).toBe(true);
    expect(wrapper.find('[data-test-node-content]').exists()).toBe(true);

    expect(wrapper.find('[data-test-node-title]').text()).toBe(node.title);
    expect(wrapper.find('[data-test-node-content]').text()).toBe(node.content);
  });

  it('has placeholders for title and content', () => {
    const wrapper = createWrapper([{ ...node, title: '', content: '' }]);

    expect(wrapper.find('[data-test-node-title]').text()).toEqual('add a title...');
    expect(wrapper.find('[data-test-node-content]').text()).toEqual(
      'double click to add content or edit it...',
    );
  });

  describe('when the node has child nodes', () => {
    it('renders the child nodes', () => {
      const childNodes = [
        {
          uuid: '26656fbd-581e-4034-9339-fe1206d95778',
          parentNode: '354c62c5-feb1-41a8-828d-4e895ce43886',
          title: 'first child node lvl 1',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: '2023-06-16T21:59:54.858Z',
          updatedAt: '2023-06-16T21:59:54.858Z',
        },
        {
          uuid: 'd4d6bebc-f377-48dc-b92a-1e4e2e407c01',
          parentNode: '354c62c5-feb1-41a8-828d-4e895ce43886',
          title: 'second child node lvl 1',
          content: 'my content',
          resolved: false,
          childNodes: [],
          pomodoroCount: 0,
          createdAt: '2023-06-16T21:59:54.858Z',
          updatedAt: '2023-06-16T21:59:54.858Z',
        },
      ];

      const wrapper = createWrapper([
        { ...node, childNodes: childNodes.map((n) => n.uuid) },
        ...childNodes,
      ]);

      const renderedChildNodes = wrapper.findAll('[data-test-child-node-item]');

      expect(renderedChildNodes.length).toEqual(2);
      expect(renderedChildNodes.at(0).find('[data-test-child-node-title]').text()).toEqual(
        childNodes[0].title,
      );
      expect(renderedChildNodes.at(1).find('[data-test-child-node-title]').text()).toEqual(
        childNodes[1].title,
      );
    });
  });

  describe('when clicking the delete button', () => {
    it('emits a delete event', async () => {
      const wrapper = createWrapper();

      await wrapper.find('[data-test-node-delete]').trigger('click');
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')[0]).toEqual([node.uuid]);
    });
  });

  describe('when clicking the expand node button', () => {
    it('emits a toggle expand event', async () => {
      const wrapper = createWrapper();

      await wrapper.find('[data-test-node-expand]').trigger('click');
      expect(wrapper.emitted('toggleExpand')).toBeTruthy();
    });
  });

  describe('when the node does not exist', () => {
    it('emits a node not found event', () => {
      const wrapper = createWrapper([]);

      expect(wrapper.emitted('nodeNotFound')).toBeTruthy();
    });
  });

  describe('when clicking on show pomodoro panel button', () => {
    it('emits a toggle pomodoro panel event', async () => {
      const wrapper = createWrapper();

      await wrapper.find('[data-test-show-pomodoro-panel]').trigger('click');
      expect(wrapper.emitted('togglePomodoroPanel')).toBeTruthy();
    });
  });
});
