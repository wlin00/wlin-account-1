import { defineComponent, PropType } from 'vue';
import s from './Button.module.scss';

export const Button = defineComponent({
  // inheritAttrs: false, // 取消默认根组件属性继承
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
      required: false,
    },
    level: {
      type: String as PropType<'important' | 'normal' | 'danger'>,
      default: 'important'
    }
  },
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <button onClick={props?.onClick || null} class={[s.button, s[props.level]]}>
        { slots.default?.() }
      </button>
    )
  }
})