import { defineComponent, PropType } from 'vue';
import s from './CommonBottomWrap.module.scss';
export const CommonBottomWrap = defineComponent({
  props: {
    mode: {
      type: String as PropType<'normal' | 'welcome'>,
      default: 'normal'
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={[s.wrap, s[`wrap_${props.mode}`]]} >
        <a href="http://beian.miit.gov.cn/" target='_blank'>京ICP备2023002005号</a>
      </div>
    )
  }
})