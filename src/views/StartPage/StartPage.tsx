import { defineComponent } from 'vue';
import s from './StartPage.module.scss';
import { Button } from '../../components/Button/Button'

export const StartPage = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      console.log('click')
    }
    return () => (
      <div class={s.wrap}>
        <div class={s.btnWrap}>
          <Button class={s.button} onClick={onClick} >测试</Button>
        </div>
      </div>
    )
  }
})