import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/IndexView.vue'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/install',
      name: 'install',
      component: () => import('../views/install/IndexView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/IndexView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/layout',
      name: 'layoout',
      component: () => import('../views/layout/IndexView.vue'),
      redirect: '/upload',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/IndexView.vue'),
        },
        {
          path: '/upload',
          name: 'upload',
          component: () => import('../views/upload/IndexView.vue'),
        },
        {
          path: '/pic',
          name: 'pic',
          component: () => import('../views/pic/IndexView.vue'),
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('../views/setting/IndexView.vue'),
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404/IndexView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
})

router.beforeEach(authGuard)

export default router
