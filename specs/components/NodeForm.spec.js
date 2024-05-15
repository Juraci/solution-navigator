import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mount } from '@vue/test-utils';
import NodeForm from '@/components/NodeForm.vue';
import { createTestingPinia } from '@pinia/testing';
import { useNodeStore } from '@/stores/NodeStore';

describe('NodeForm', () => {
  let wrapper = null;
  let store = null;

  beforeEach(() => {
    wrapper = mount(NodeForm, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              NodeStore: { nodes: [] },
            },
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    });

    store = useNodeStore();
  });

  it.skip('renders', () => {
    expect(wrapper.find('[data-test-input]').exists()).toBe(true);
    expect(wrapper.find('[data-test-btn]').exists()).toBe(true);
  });

  it.skip('adds nodes', async () => {
    const nodeTitle = 'Persist pinia state in indexed db';
    wrapper.find('[data-test-input]').setValue(nodeTitle);
    await wrapper.find('form').trigger('submit');

    expect(store.addNode).toHaveBeenCalledTimes(1);
    expect(store.nodes.length).toBe(1);
    expect(store.nodes[0]).toHaveProperty('title', nodeTitle);
  });

  it.skip('does not add if the title is empty', async () => {
    wrapper.find('[data-test-input]').setValue('');
    await wrapper.find('form').trigger('submit');

    expect(store.addNode).not.toHaveBeenCalledTimes(1);
  });
});
