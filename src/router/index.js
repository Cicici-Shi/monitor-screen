import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    component: () => import('@/views/main/main-screen.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router 