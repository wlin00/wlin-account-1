import { defineComponent, ref } from 'vue';
import { RouterView } from 'vue-router';
import style from './styles/Layout.module.scss'
import logo from '../assets/icons/logo.svg'

export const Layout = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={style.wrapper}>
        <header>
          <img src={logo} />
          <h1>Wlin记账</h1>
        </header>
        <main class={style.main}>
          <RouterView />
        </main>
      </div>
    )
  }
})