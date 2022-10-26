import { defineComponent, ref } from 'vue';
import style from './styles/WelcomeFirst.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router';

export const WelcomeThird = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={style.wrapper}>
        <div class={style.card}>
          <img class={style.pig} src={logo}/>
          <h2>333会挣钱<br/>还要会省钱</h2>
        </div>
        <div class={style.action}>
          <RouterLink class={style.fake} to="/start" >占位</RouterLink>
          <RouterLink to="/welcome/4" >下一页</RouterLink>
          <RouterLink to="/start" >跳过</RouterLink>
        </div>
      </div>
    )
  }
})