import { defineComponent } from 'vue';
import s from './ComingSoon.module.scss';
import { CenterWrapper } from '../../components/CenterWrapper/CenterWrapper';
import { Icon } from '../../components/CustomIcon/Icon';
import { Button } from '../../components/Button/Button';
import { useRouter } from 'vue-router';
import { MainLayout } from '../../layout/MainLayout/MainLayout';
import { OverlayIcon } from '../../components/Overlay/Overlay';
export const ComingSoon = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const onClick = () => {
      router.back()
    }
    return () => (
      <MainLayout class={s.layout}>
      {{
        title: () => 'Wlin记账单',
        icon: () => <OverlayIcon />,
        default: () => <>
        <CenterWrapper class={s.pig_wrapper}>
          <Icon name="pig" class={s.pig}></Icon>
        </CenterWrapper>
        <p class={s.text}>敬请期待</p>
        <p class={s.link}>
          <Button onClick={onClick}>返回</Button>
        </p>
      </>}}</MainLayout>
    )
  }
})

export default ComingSoon