import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { About } from './views/About/About'
import { Home } from './views/Home/Home'
import { Layout } from './components/Layout'
import { WelcomeFirst } from './views/Welcome/WelcomeFirst'
import { WelcomeSecond } from './views/Welcome/WelcomeSecond'
import { WelcomeThird } from './views/Welcome/WelcomeThird'
import { WelcomeFourth } from './views/Welcome/WelcomeFourth'

const routes: RouteRecordRaw = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { 
    path: '/welcome', 
    component: Layout,
    redirect: '/welcome/1',
    children: [
      { 
        path: '1', 
        component: WelcomeFirst 
      },
      { 
        path: '2', 
        component: WelcomeSecond 
      },
      { 
        path: '3', 
        component: WelcomeThird 
      },
      { 
        path: '4', 
        component: WelcomeFourth 
      },
    ]
  },

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

 
