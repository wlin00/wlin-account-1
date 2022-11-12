import s from './welcome.module.scss';
import { defineComponent, ref, watchEffect } from 'vue';
import { useSwipe } from '../../../hooks/useSwipe';
import { useRouter } from 'vue-router'

export const First = defineComponent({
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
        router.push('/welcome/2')
      }
    })

    return () => (
      <div class={s.card} ref={main}>
        <svg>
          <use xlinkHref='#pig'></use>
        </svg>
        <h2>会挣钱<br/>还会省钱</h2>
      </div>
    )
  }
})