import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
// views
import { Welcome } from "./views/Welcome/Welcome";
import { StartPage } from "./views/StartPage/StartPage";
import { Items } from "./views/Items/Items";
import { TagPage } from "./views/TagPage/TagPage";

// components
import { First } from "./views/Welcome/components/First";
import { FirstActions } from "./views/Welcome/components/FirstActions";
import { Forth } from "./views/Welcome/components/Forth";
import { ForthActions } from "./views/Welcome/components/ForthActions";
import { Second } from "./views/Welcome/components/Second";
import { SecondActions } from "./views/Welcome/components/SecondActions";
import { Third } from "./views/Welcome/components/Third";
import { ThirdActions } from "./views/Welcome/components/ThirdActions";
import { ItemList } from "./views/Items/components/ItemList/ItemList";
import { ItemCreate } from "./views/Items/components/ItemCreate/ItemCreate";
import { TagCreate } from "./views/TagPage/components/TagCreate/TagCreate";
import { TagEdit } from "./views/TagPage/components/TagEdit/TagEdit";

const history = createWebHashHistory()
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  {
    path: '/welcome', // 导航页面，默认重定向到导航1
    component: Welcome,
    redirect: '/welcome/1',
    children: [
      { path: '1', name: 'welcome1', components: { main: First, footer: FirstActions }, },
      { path: '2', name: 'welcome2', components: { main: Second, footer: SecondActions }, },
      { path: '3', name: 'welcome3', components: { main: Third, footer: ThirdActions }, },
      { path: '4', name: 'welcome4', components: { main: Forth, footer: ForthActions }, },
    ]
  },
  { path: '/start', name: 'start', component: StartPage }, // 开始页面
  {
    path: '/items', // 内容页面，默认重定向到内容列表
    component: Items,
    redirect :'/items/list',
    children: [
      { path: 'list', name: 'list', component: ItemList },
      { path: 'create', name: 'create', component: ItemCreate },
    ]
  },
  {
    path: '/tags',
    component: TagPage,
    redirect: '/tags/create',
    children: [
      { path: 'create', component: TagCreate },
      { path: ':id/edit', component: TagEdit },
    ]
  }
]

export const router = createRouter({ 
  history,
  routes 
})