import { defineComponent } from 'vue';
import { Icon } from '../../components/CustomIcon/Icon';
import { Navbar } from '../../components/Navbar/Navbar'
import s from './MainLayout.module.scss';

export const MainLayout = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div class="s.wrap">
        <Navbar class={s.navbar}>{{
          default: () => slots.title?.(),
          icon: () => slots.icon?.(),
        }}</Navbar >
        <div>{
          slots.default?.()
        }</div>
      </div>
    )
  }
})