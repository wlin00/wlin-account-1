import { defineComponent, PropType } from 'vue';
import s from './CenterWrapper.module.scss';
export const CenterWrapper = defineComponent({
  props: {
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={[s.wrapper, s[`wrapper_${props.direction}`]]}>{ context.slots.default?.() }</div>
    )
  }
})