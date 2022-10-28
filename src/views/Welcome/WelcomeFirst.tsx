import { defineComponent, ref, FuntionalComponent } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'
import { WelcomeWrapper } from './components/WelcomeWrapper'

// setup写法
export const WelcomeFirst: FuntionalComponent = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeWrapper>
        {{
          logo: () =>  <img class={style.pig} src={logo}/>,
          font: () => <h2>111会挣钱<br/>还要会省钱</h2>,
          actions: () => <>
            <RouterLink class={style.fake} to="/start" >占位</RouterLink>
            <RouterLink to="/welcome/2" >下一页</RouterLink>
            <RouterLink to="/start" >跳过</RouterLink>
          </>
        }}
      </WelcomeWrapper>
    )
  }
})