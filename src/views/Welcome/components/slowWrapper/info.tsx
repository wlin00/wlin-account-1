import { defineComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { SlotWrapper } from './slotWrapper'
import style from '../welcome.module.scss';
import logo from '../../../../assets/icons/logo.svg'

export const Info = defineComponent({
  setup: (props, context) => {
    const slots = {
      icon: () => <img class={style.pig} src={logo} />,
      font: () => <h2>title</h2>,
      action: () => <>
        <RouterLink to="/welcome/1">上一页</RouterLink>
        <RouterLink to="/welcome/2">上一页</RouterLink>
      </>
    }
    return () => (
      <SlotWrapper v-slots={slots}></SlotWrapper>
    )
  }
})