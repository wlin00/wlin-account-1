import s from './welcome.module.scss';
import { defineComponent, ref, watchEffect } from 'vue';
import { useSwipe } from '../../../hooks/useSwipe';
import { useRouter } from 'vue-router'

export const Second = defineComponent({
  setup: (props, context) => {
    const main = ref<HTMLElement>()
    const router = useRouter()
    const { direction, swiping, distance } = useSwipe(main, {
      beforeTouchStart: (e: TouchEvent) => {
        e.preventDefault() // 滑动开始前的钩子，中止默认的浏览器外框华滑动事件
      }
    })
    watchEffect(() => {
      if (swiping.value && direction.value === 'left') {
        router.push('/welcome/3')
      }
    })

    return () => (
      <div class={s.card} ref={main}>
      <svg>
        <use xlinkHref='#clock'></use>
      </svg>
      <h2>每日提醒<br />不遗漏每一笔账单</h2>
    </div>
    )
  }
})