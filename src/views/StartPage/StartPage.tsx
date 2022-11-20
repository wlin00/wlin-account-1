import { defineComponent } from 'vue';
import s from './StartPage.module.scss';
import { Button } from '../../components/Button/Button'
import { FloatButton } from '../../components/FloatButton/FloatButton';
import { CenterWrapper } from '../../components/CenterWrapper/CenterWrapper';
import { Icon } from '../../components/CustomIcon/Icon';
import { Navbar } from '../../components/Navbar/Navbar';

export const StartPage = defineComponent({
  props: {

  },
  setup: (props, context) => {
    const onClick = () => {
      console.log('click')
    }
    return () => (
      <div class={s.wrap}>
        <Navbar class={s.navbar}>{{
          default: 'Wlin记账',
          icon: <Icon name="menu" class={s.navbar_icon}/>
        }}</Navbar>
        <CenterWrapper class={s.centerWrapper}>
          <Icon name="pig" class={s.centerWrapper_icon}></Icon>
        </CenterWrapper>
        <div class={s.btnWrap}>
          <Button class={s.button} onClick={onClick} >测试</Button>
        </div>
        <FloatButton name="add" />
      </div>
    )
  }
})