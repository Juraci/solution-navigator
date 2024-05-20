import { createRouter, createWebHistory } from 'vue-router';
import HomeIndex from '@/views/HomeIndex.vue';

const routes = [
  {
    path: '/',
    name: 'HomeIndex',
    component: HomeIndex,
    children: [
      {
        path: 'nodes/:uuid',
        name: 'node.show',
        component: () => import('@/views/NodeShow.vue'),
        props: (route) => ({ nodeUuid: route.params.uuid }),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
