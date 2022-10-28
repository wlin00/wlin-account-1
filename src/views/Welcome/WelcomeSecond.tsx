import { defineComponent, ref } from 'vue'
import style from './styles/WelcomeCommon.module.scss'
import logo from '../../assets/icons/logo.svg'
import { RouterLink } from 'vue-router'
import { WelcomeWrapper } from './components/WelcomeWrapper'

export const WelcomeSecond = defineComponent({
  setup: (props, context) => {
    return () => (
      <WelcomeWrapper>
        {{
          logo: () =>  <img class={style.pig} src={logo}/>,
          font: () => <h2>222会挣钱<br/>还要会省钱</h2>,
          actions: () => <>
            <RouterLink to="/welcome/1" >上一页</RouterLink>
            <RouterLink to="/welcome/3" >下一页</RouterLink>
            <RouterLink to="/start" >跳过</RouterLink>
          </>
        }}
      </WelcomeWrapper>
    )
  }
})
