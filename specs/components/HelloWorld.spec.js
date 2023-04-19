import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import HelloWorld from '@/components/HelloWorld.vue';
import { useNodeStore } from '@/stores/NodeStore';

describe('HelloWorld', () => {
  let wrapper = null;

  it('renders properly', () => {
    wrapper = mount(HelloWorld, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              NodeStore: {
                nodes: [{ title: 'My Title' }],
              },
            },
            createSpy: vi.fn(),
          }),
        ],
      },
      props: { msg: 'Hello Vitest' },
    });

    expect(wrapper.text()).toContain('Hello Vitest');
    expect(wrapper.findAll('.node').length).toEqual(1);
    expect(wrapper.findAll('.node').at(0).text()).toEqual('My Title');
  });

  it('handles empty state', () => {
    wrapper = mount(HelloWorld, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              NodeStore: {
                nodes: [],
              },
            },
            createSpy: vi.fn(),
          }),
        ],
      },
      props: { msg: 'Hello Vitest' },
    });

    expect(wrapper.findAll('.node').length).toEqual(0);
  });
});
