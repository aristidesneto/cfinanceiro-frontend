import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const isAuthenticated = useStore().getters.isAuthenticated;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) return { name: 'Login' };
  }
  return true;
});

export default router;
