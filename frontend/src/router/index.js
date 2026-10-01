import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'Admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router