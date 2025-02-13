import { createRouter, createWebHistory } from 'vue-router';
import webRoute from './web';
import { useAuthStore } from '@/stores';

const routes = [
  ...webRoute,
  {
    path: '/:catchAll(.*)',
    name: '404 NotFound',
    meta: {
      requiresAuth: true,
    },
    component: () => import('@/pages/error/_404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'isActive',
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const isLoggedIn = authStore.isLoggedIn;
  const isAdmin = authStore.isAdmin;
  const isAuthRoute = to.matched.some((record) => record.meta.requiresAuth);
  const isAdminRoute = to.matched.some((record) => record.meta.requiresAdmin);

  if (isAuthRoute && !isLoggedIn) {
    authStore.clearLocalStorage();
    next('/login');
    return;
  }

  if (isAdminRoute && !isAdmin) {
    next({ path: 'NotFound' });
    return;
  }

  if (isLoggedIn && !isAuthRoute) {
    next('/');
    return;
  }

  next();
});

export default router;
