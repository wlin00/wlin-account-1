import { defineComponent, ref, Transition, VNode, watchEffect } from 'vue';
import { RouteLocationNormalizedLoaded, RouterView, useRouter, useRoute } from 'vue-router';
import { useSwipe } from '../../hooks/useSwipe';
import { throttle } from '../../utils';
import s from './Welcome.module.scss'
export const Welcome = defineComponent({
  setup: (props, context) => {
    const main = ref<HTMLElement | null>(null)
    const router = useRouter()
    const route = useRoute()
    const { direction, distance, swiping } = useSwipe(main)
    const push = throttle(() => { // 手指滑动事件节流，节流时间为动画的时间
      if (route.name === 'welcome1') {
        router.push('/welcome/2')
      } else if (route.name === 'welcome2') {
        router.push('/welcome/3')
      } else if (route.name === 'welcome3') {
        router.push('/welcome/4')
      } else if (route.name === 'welcome4') {
        router.push('/start')
      }
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
        <h1>山竹记账</h1>
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