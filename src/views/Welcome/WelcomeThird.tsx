import { defineComponent, ref, FuntionalComponent } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'
import { WelcomeWrapper } from './components/WelcomeWrapper'

export const WelcomeThird: FuntionalComponent = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeWrapper>
        {{
          logo: () =>  <img class={style.pig} src={logo}/>,
          font: () => <h2>333会挣钱<br/>还要会省钱</h2>,
          actions: () => <>
            <RouterLink to="/welcome/2" >上一页</RouterLink>
            <RouterLink to="/welcome/4" >下一页</RouterLink>
            <RouterLink to="/start" >跳过</RouterLink>
          </>
        }}
      </WelcomeWrapper>
    )
  }
})