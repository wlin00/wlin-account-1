import { defineComponent, ref } from 'vue'
import style from '../styles/WelcomeCommon.module.scss'

// 容器组件，传入插槽构建welcome页面
export const WelcomeWrapper = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div class={style.wrapper}>
        <div class={style.card}>
          {/* <img class={style.pig} src={logo}/> */}
          {/* <h2>111会挣钱<br/>还要会省钱</h2> */}
          {slots.icon?.()}
          {slots.font?.()}
        </div>
        <div class={style.actions}>
          {/* <RouterLink class={style.fake} to="/start" >占位</RouterLink>
          <RouterLink to="/welcome/2" >下一页</RouterLink>
          <RouterLink to="/start" >跳过</RouterLink> */}
          {slots?.actions()}
        </div>
      </div>
    )
  }
})