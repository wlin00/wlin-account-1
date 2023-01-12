import { defineComponent } from 'vue';
import s from './Items.module.scss';
import { RouterView } from 'vue-router'
export const Items = defineComponent({
  setup: (props, context) => {
    return () => (
      <div>
        <RouterView />
      </div>
    )
  }
})

export default Items