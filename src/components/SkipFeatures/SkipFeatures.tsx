import { defineComponent } from 'vue';
import s from './SkipFeatures.module.scss';
import { RouterLink } from 'vue-router';

export const SkipFeatures = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    const onClick = () => {
      localStorage.setItem('skipFeatures', '1')
    }
    return () => (
      <span onClick={onClick}>
        <RouterLink to="/start">{ slots.default?.() }</RouterLink>
      </span>
    )
  }
})