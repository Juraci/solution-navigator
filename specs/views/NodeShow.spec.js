import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import NodeShow from '@/views/NodeShow.vue';
import { createTestingPinia } from '@pinia/testing';

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

  describe('when clicking the delete button', () => {
    it('emits a delete event', async () => {
      const wrapper = createWrapper();

      await wrapper.find('[data-test-node-delete]').trigger('click');
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')[0]).toEqual([node.uuid]);
    });
  });

  describe('when the node does not exist', () => {
    it('emits a node not found event', () => {
      const wrapper = createWrapper([]);

      expect(wrapper.emitted('nodeNotFound')).toBeTruthy();
    });
  });
});
