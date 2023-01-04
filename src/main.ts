import { createApp } from 'vue'
import { App } from './App'
import { router } from './router'
import '@svgstore';
import { fetchMeInfo, mePromise } from './utils/Me';

// 首次进入系统的需要权限模块，将《拉取用户信息的promise》赋予给mePromise
const whiteList = ['/sign_in', '/welcome', '/start']
let noJudgeFlag = false
for (let i = 0; i < whiteList.length; i++) {
  if (location.href.includes(whiteList[i])) {
    noJudgeFlag = true
    break
  }
}
if (location.href.slice(-3) === '/#/') {
  noJudgeFlag = true
}
if (!noJudgeFlag) { // 若进入需要权限的模块，则拉取用户信息
  fetchMeInfo()
}
// 在每次进入需要权限的特定路由时，await mePromise，根据resolve/reject的结果来决定是否进入对应路由/或重定向登陆页
router.beforeEach(async(to, from) => {
  // 若进入不需要权限的路由，可以直接放行
  if (to.path === '/' || to.path.startsWith('/welcome') || to.path.startsWith('/sign_in') || to.path === '/start') {
    return true
  } else {
    try {
      await mePromise
      return true // 若进入需要权限的路由，且能成功拉取用户信息接口，则放行
    } catch {
      return `/sign_in?return_to=${encodeURIComponent(to.path)}` // 若进入需要权限的路由，但不能成功拉取用户信息接口，则重定向登陆
    }
    // const path = await mePromise!.then(
    //   () => true,
    //   () => '/sign_in?return_to=' + to.path
    // )
    // return path
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
