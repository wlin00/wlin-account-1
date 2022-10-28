import { defineComponent, ref, FuntionalComponent } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'

// setup写法
export const WelcomeFourth: FuntionalComponent = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={style.card}>
        <img src={style.pig} />
        <h2>会挣钱<br />还会省钱</h2>
      </div>
    )
  }
})