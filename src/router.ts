import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { First } from "./views/Welcome/components/First";
import { FirstActions } from "./views/Welcome/components/FirstActions";
import { Forth } from "./views/Welcome/components/Forth";
import { ForthActions } from "./views/Welcome/components/ForthActions";
import { Second } from "./views/Welcome/components/Second";
import { SecondActions } from "./views/Welcome/components/SecondActions";
import { Third } from "./views/Welcome/components/Third";
import { ThirdActions } from "./views/Welcome/components/ThirdActions";
import { Welcome } from "./views/Welcome/Welcome";

const history = createWebHashHistory()
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  {
    path: '/welcome',
    component: Welcome,
    redirect: '/welcome/1',
    children: [
      { path: '1', name: 'welcome1', components: { main: First, footer: FirstActions }, },
      { path: '2', name: 'welcome2', components: { main: Second, footer: SecondActions }, },
      { path: '3', name: 'welcome3', components: { main: Third, footer: ThirdActions }, },
      { path: '4', name: 'welcome4', components: { main: Forth, footer: ForthActions }, },
    ]
  }
]

export const router = createRouter({ 
  history,
  routes 
})