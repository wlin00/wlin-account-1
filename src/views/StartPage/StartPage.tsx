import { defineComponent, ref } from 'vue';
import s from './StartPage.module.scss';
import { Button } from '../../components/Button/Button'
import { FloatButton } from '../../components/FloatButton/FloatButton';
import { CenterWrapper } from '../../components/CenterWrapper/CenterWrapper';
import { Icon } from '../../components/CustomIcon/Icon';
import { Navbar } from '../../components/Navbar/Navbar';
import { Overlay, OverlayIcon } from '../../components/Overlay/Overlay';
import { useRouter } from 'vue-router'
import { MainLayout } from '../../layout/MainLayout/MainLayout';
export const StartPage = defineComponent({
  props: {

  },
  setup: (props, context) => {
    const overlayVisible = ref(false)
    const router = useRouter()
    const handleJump = () => {
      console.log(123)
      router.push('/items/list')
    }
    const handleMenuSwitch = () => {
      overlayVisible.value = !overlayVisible.value
    }
    return () => (
      <MainLayout>{{
        title: () => 'Wlin记账',
        icon: () => <OverlayIcon />,
        default: () => <>
          <CenterWrapper class={s.centerWrapper}>
            <Icon name="pig" class={s.centerWrapper_icon}></Icon>
          </CenterWrapper>
          <div class={s.btnWrap}>
            <Button class={s.button} onClick={handleJump} >开始记账</Button>
          </div>
          <FloatButton name="add" onClick={handleJump} />
        </>
      }}</MainLayout>
    )
  }
})