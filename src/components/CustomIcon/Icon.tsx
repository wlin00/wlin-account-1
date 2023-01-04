import { defineComponent, PropType } from 'vue';
import s from './Icon.module.scss';

export const Icon = defineComponent({
  props: {
    // name: String as PropType<'add' | 'chart' | 'clock' | 'cloud' | 'mangosteen' | 'pig'>
    name: {
      type: String,
      default: 'add'
    },
    onClick: Function
  },
  setup: (props, context) => {
    return () => (
      <svg onClick={props.onClick}>
        <use xlinkHref={'#' + props.name}></use>
      </svg>
    )
  }
})