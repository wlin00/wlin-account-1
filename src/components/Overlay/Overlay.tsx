import { defineComponent, PropType, ref, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Icon } from '../CustomIcon/Icon';
import s from './Overlay.module.scss';
import { mePromise, fetchMeInfo } from '../../utils/Me';
import { User } from '../../utils/types';
import { Dialog } from 'vant';

export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const close = () => {
      props.onClose?.()
    }
    const onClickSignIn = () => {}
    const meInfo = ref<User>()

    const list = [
      { path: '/items/list', name: '我的记账', icon: 'home' },
      { path: '/statistics', name: '统计图表', icon: 'charts' },
      // { path: '/export', name: '导出数据', icon: 'export' },
      { path: '/notify', name: '记账提醒', icon: 'notify' },
    ]
    const init = async () => {
      try {
        const res = await mePromise
        meInfo.value = res?.data.resource
      } catch {}
    }
    const handleSignOut = async () => {
      try {
        await Dialog.confirm({
          title: '确认',
          message: '你真的要退出登录吗？',
        })
        localStorage.removeItem('jwt')
        fetchMeInfo()
        router.push({
          path: '/sign_in',
          query: {
            return_to: route.fullPath
          }
        })
      } catch {
      }
    }
    onMounted(() => {
      init()
    })

    return () => (
      <>
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <section class={s.currentUser}>
            {
              meInfo.value ? 
                (<div>
                  <h2 class={s.email}>{meInfo.value.email}</h2>
                  <p onClick={handleSignOut}>退出登录</p>
                </div>) :
                (<RouterLink to={`sign_in?return_to=${route.fullPath}`}>
                  <h2>未登录用户</h2>
                  <p>点击这里登录</p>
                </RouterLink>)
            }
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
