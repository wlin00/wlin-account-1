import { defineComponent, ref } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'
import { WelcomeWrapper } from './components/WelcomeWrapper'

export const WelcomeFourth = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeWrapper>
        {{
          logo: () =>  <img class={style.pig} src={logo}/>,
          font: () => <h2>444会挣钱<br/>还要会省钱</h2>,
          actions: () => <>
            <RouterLink to="/welcome/3" >上一页</RouterLink>
            <RouterLink to="/start" >下一页</RouterLink>
            <RouterLink to="/start" >跳过</RouterLink>
          </>
        }}
      </WelcomeWrapper>
    )
  }
})
