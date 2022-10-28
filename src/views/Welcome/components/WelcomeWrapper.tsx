import { defineComponent, ref, FunctionalComponent } from 'vue'
import style from '../styles/WelcomeCommon.module.scss'

// 容器组件，传入插槽构建welcome页面
export const WelcomeWrapper: FunctionalComponent = defineComponent({
  setup: (props, context) => {
    const { slots: { icon, font, actions } } = context
    return () => (
      <div class={style.wrapper}>
        <div class={style.card}>
          {icon?.()}
          {font?.()}
        </div>
        <div class={style.actions}>
          {actions?.()}
        </div>
      </div>
    )
  }
})