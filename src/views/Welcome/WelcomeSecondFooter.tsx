import { defineComponent, ref, FuntionalComponent } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'

// setup写法
export const WelcomeSecondFooter: FuntionalComponent = defineComponent({
  setup: (props, context) => {
    return () => <div class={style.actions}>
      <RouterLink class={style.fake} to="/start" >跳过</RouterLink>
      <RouterLink to="/welcome/3" >下一页</RouterLink>
      <RouterLink to="/start" >跳过</RouterLink>
    </div>
  }
})