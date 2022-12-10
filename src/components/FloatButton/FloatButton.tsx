import { defineComponent, PropType } from 'vue';
import s from './FloatButton.module.scss';
import { Icon } from '../CustomIcon/Icon'

export const FloatButton = defineComponent({
  props: {
    name: {
      type: String,
      default: 'add'
    },
    onClick: Function as PropType<() => void>
  },
  setup: (props, context) => {
    return () => (
      <div class={s.floatButton} onClick={props.onClick}>
        <Icon name={props.name} class={s.icon} />
      </div>
    )
  }
})