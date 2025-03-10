import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LeaderboardView from '@/views/LeaderboardView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'leaderboard',
    component: LeaderboardView,
  },
  {
    path: '/exercise-modal',
    name: 'exercise-modal',
    component: LeaderboardView,
    // Option B: load a blank/minimal component if you want
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: () => import('@/views/AdminView.vue') // if you have an Admin page
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
