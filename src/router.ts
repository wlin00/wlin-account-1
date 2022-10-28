import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Layout } from './components/Layout'
import { WelcomeFirst } from './views/Welcome/WelcomeFirst'
import { WelcomeSecond } from './views/Welcome/WelcomeSecond'
import { WelcomeThird } from './views/Welcome/WelcomeThird'
import { WelcomeFourth } from './views/Welcome/WelcomeFourth'
import { WelcomeFirstFooter } from './views/Welcome/WelcomeFirstFooter'
import { WelcomeSecondFooter } from './views/Welcome/WelcomeSecondFooter'
import { WelcomeThirdFooter } from './views/Welcome/WelcomeThirdFooter'
import { WelcomeFourthFooter } from './views/Welcome/WelcomeFourthFooter'

const routes: RouteRecordRaw = [
  { path: '/', redirect: '/welcome' },
  { 
    path: '/welcome', 
    component: Layout,
    redirect: '/welcome/1',
    children: [
      { 
        path: '1', // 多重 RouterView
        components: { main: WelcomeFirst, footer: WelcomeFirstFooter }
      },
      { 
        path: '2', 
        components: { main: WelcomeSecond, footer: WelcomeSecondFooter } 
      },
      { 
        path: '3', 
        components: { main: WelcomeThird, footer: WelcomeThirdFooter } 
      },
      { 
        path: '4', 
        components: { main: WelcomeFourth, footer: WelcomeFourthFooter } 
      },
    ]
  },

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

 
