import { defineComponent, PropType } from 'vue';
import s from './Icon.module.scss';

export const Icon = defineComponent({
  props: {
    // name: String as PropType<'add' | 'chart' | 'clock' | 'cloud' | 'mangosteen' | 'pig'>
    name: {
      type: String,
      default: 'add'
    }
  },
  setup: (props, context) => {
    return () => (
      <svg>
        <use xlinkHref={'#' + props.name}></use>
      </svg>
    )
  }
})