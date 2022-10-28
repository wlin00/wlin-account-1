import { defineComponent, ref, Transition, VNode, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import style from './styles/Layout.module.scss'
import logo from '../assets/icons/logo.svg'

export const Layout = defineComponent({
  setup: (props, context) => {
    return () => <div class={style.wrapper}>
      <header>
        <img src={logo} alt=""/>
        <h1>山竹记账</h1>
      </header>
      <main class={style.main} >
        <RouterView name="main">
          {({ Component: X, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
            <Transition enterFromClass={style.slide_fade_enter_from} enterActiveClass={style.slide_fade_enter_active}
              leaveToClass={style.slide_fade_leave_to} leaveActiveClass={style.slide_fade_leave_active}>
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