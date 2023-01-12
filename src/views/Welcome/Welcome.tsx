import { defineComponent, ref, Transition, VNode, watchEffect } from 'vue';
import { RouteLocationNormalizedLoaded, RouterView, useRouter, useRoute } from 'vue-router';
import { useSwipe } from '../../hooks/useSwipe';
import { throttle } from '../../utils';
import s from './Welcome.module.scss'
interface IRouteMap {
  welcome1: string;
  welcome2: string;
  welcome3: string;
  welcome4: string;
}
export const Welcome = defineComponent({
  setup: (props, context) => {
    const main = ref<HTMLElement | null>(null)
    const router = useRouter()
    const route = useRoute()
    // @ts-ignore
    const { direction, distance, swiping } = useSwipe(main)
    const routeMap: Record<keyof IRouteMap, string> = {
      'welcome1': '/welcome/2',
      'welcome2': '/welcome/3',
      'welcome3': '/welcome/4',
      'welcome4': '/start',
    }
    const push = throttle(() => { // 手指滑动事件节流，节流时间为动画的时间
      const routeName = route.name as keyof IRouteMap // 将routeName类型约束在string，若是symbol则进行toString，若是null/undefined则给默认值
      const path = routeMap[routeName]
      router.push(path)
    }, 500)
    watchEffect(() => {
      if (swiping.value && direction.value === 'left') { // 当前若进行手指左滑，则动画切换至下一个页面
        push()
      }
    })
    return () => <div class={s.wrapper}>
      <header>
        <svg>
          <use xlinkHref='#mangosteen'></use>
        </svg>
        <h1>Wlin记账</h1>
      </header>
      <main class={s.main} ref={main}>
        <RouterView name="main">
          {({ Component: X, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
            <Transition enterFromClass={s.slide_fade_enter_from} enterActiveClass={s.slide_fade_enter_active}
              leaveToClass={s.slide_fade_leave_to} leaveActiveClass={s.slide_fade_leave_active}>
              {X}
            </Transition>
          }
        </RouterView>
      </main>
      <footer>
        <RouterView name="footer" />
      </footer>
    </div>
  }
})