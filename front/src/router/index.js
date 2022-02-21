import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/404',
      name: 'Page Not Found',
      component: () => import('../views/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'Page Not Found'
      }
    }
  ]
})

export default router
