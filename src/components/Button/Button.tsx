import { defineComponent } from 'vue';
import s from './Button.module.scss';

interface Props {
  onClick: (e: MouseEvent) => void
}
export const Button = defineComponent<Props>({
  // inheritAttrs: false, // 取消默认根组件属性继承
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <button class={s.button}>
        { slots.default?.() }
      </button>
    )
  }
})