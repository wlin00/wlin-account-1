import { defineComponent } from 'vue';
import style from '../welcome.module.scss';

// 用于传入slots插槽调用的容器组件
export const SlotWrapper = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div class={style.wrapper}>
        <div class={style.card}>
          { slots.icon?.() }
          { slots.font?.() }
        </div>
        <div class={style.actions}>
          { slots.actions?.() }
        </div>
      </div>
    )
  }
})