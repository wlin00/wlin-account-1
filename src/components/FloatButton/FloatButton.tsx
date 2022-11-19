import { defineComponent } from 'vue';
import s from './FloatButton.module.scss';
import { Icon } from '../CustomIcon/Icon'

export const FloatButton = defineComponent({
  props: {
    name: {
      type: String,
      default: 'add'
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.floatButton}>
        <Icon name={props.name} class={s.icon} />
      </div>
    )
  }
})