import { createRouter, createWebHashHistory } from 'vue-router'
import { About } from './views/About'
import { Home } from './views/Home'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

 
