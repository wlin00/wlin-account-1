import { defineComponent } from 'vue';
import s from './Navbar.module.scss';

export const Navbar = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div class={s.wrap}>
        <div class={s.iconWrap}>
          { slots.icon?.() }
        </div>
        <div class={s.fontWrap}>
          { slots.default?.() }
        </div>
      </div>
    )
  }
})