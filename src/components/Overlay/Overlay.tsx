import { defineComponent, PropType, ref } from 'vue';
import { RouterLink } from 'vue-router'
import { Icon } from '../CustomIcon/Icon';
import s from './Overlay.module.scss';

export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.()
    }
    const onClickSignIn = () => {}
    const list = [
      { path: '/statistics', name: '统计图表', icon: 'charts' },
      { path: '/export', name: '导出数据', icon: 'export' },
      { path: '/notify', name: '记账提醒', icon: 'notify' },
    ]

    return () => (
      <>
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <section class={s.currentUser} onClick={onClickSignIn}>
            <h2>未登录用户</h2>
            <p>点击这里登录</p>
          </section>
          <nav>
            <ul class={s.action_list}>
              { 
                list?.length && list.map((item: any, index: number) => (
                  <li key={index}>
                    <RouterLink to={item.path} class={s.action}>
                      <Icon name={item.icon} class={s.icon} />
                      <span>{item.name}</span>
                    </RouterLink>
                  </li>
                ))
              }
            </ul>
          </nav>
        </div>
      </>
    )
  }
})

export const OverlayIcon = defineComponent({
  setup: (props, context) => {
    
    const overlayVisible = ref<boolean>(false)
    const handleOverlayClose = () => {
      overlayVisible.value = false
    }
    const handleMenuSwitch = () => {
      overlayVisible.value = !overlayVisible.value
    }
    return () => (
      <>
        <Icon name="menu" onClick={handleMenuSwitch} class={s.icon}/>
        { 
          overlayVisible.value && 
          <Overlay onClose={handleOverlayClose} /> 
        }
      </>
    )
  }
})
