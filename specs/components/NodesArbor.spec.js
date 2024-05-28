import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import NodesArbor from '@/components/NodesArbor.vue';
import { createTestingPinia } from '@pinia/testing';

describe('NodesArbor', () => {
  it('renders a list of nodes', () => {
    const wrapper = mount(NodesArbor, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              NodeStore: {
                nodes: [
                  {
                    uuid: '8eff4189-c022-4c88-9cea-d3c66a5cee88',
                    title: 'Persist Pinia State',
                    content: 'Learn how to persist Pinia state',
                    childNodes: [],
                    parentNode: null,
                    resolved: false,
                    pomodoros: 0,
                  },
                ],
              },
            },
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    });

    expect(wrapper.findAll('[data-test-node-item]').length).toBe(1);
    const card = wrapper.find('.p-card');
    expect(card.find('.p-card-title').text()).toEqual('Persist Pinia State');
    expect(card.find('.p-card-content').text()).toEqual('Learn how to persist Pinia state');
  });
});
