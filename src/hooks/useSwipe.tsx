import { computed, onMounted, onUnmounted, ref, Ref } from "vue";

type Point = {
  x: number;
  y: number;
}

interface Options { // 同步的钩子函数，在hook手指滑动开始前后插入事件
  beforeTouchStart?: (e: TouchEvent) => void,
  afterTouchStart?: (e: TouchEvent) => void,
  beforeTouchMove?: (e: TouchEvent) => void,
  afterTouchMove?: (e: TouchEvent) => void,
  beforeTouchEnd?: (e: TouchEvent) => void,
  afterTouchEnd?: (e: TouchEvent) => void,
}

export const useSwipe = (element: Ref<HTMLElement | undefined>, options: Options) => {
  // useSwipe 自定义hook，用于监听传入的dom节点的手指滑动事件；
  // 向外部返回一个计算属性的《方向》、《滑动结束标识符》、《滑动位移》等信息的对象
  const start = ref<Point>() // typeof [Point, undefined]
  const end = ref<Point>() // typeof [Point, undefined]
  const swiping = ref<boolean>(false)

  // 计算属性： 当前手指滑动发生时的x，y偏移（笛卡尔坐标）
  const distance = computed(() => {
    if (!start.value || !end.value) {
      return null
    }
    return {
      x: end.value.x - start.value.x,
      y: end.value.y - start.value.y,
    }
  })

  // 计算属性： 当前手指滑动发生时，根据结束下标 - 开始下标，来推导出滑动方向
  const direction = computed<string>(() => {
    if (!distance.value) {
      return ''
    }
    // 根据当前偏移的y和x的绝对值（即两个坐标轴上的投影），来判定当前方向是y轴还是x轴
    const { x, y } = distance.value
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left'
    } else {
      return y > 0 ? 'down' : 'up'
    }

  })

  // 手指滑动开始 - 记录开始坐标
  const handleTouchStart = (e: TouchEvent) => {
    options?.beforeTouchStart?.(e)
    start.value = {
      x: e.touches[0].clientX, // touches[0]获取到第一根手指的活动
      y: e.touches[0].clientY, // touches[0]获取到第一根手指的活动
    }
    swiping.value = true // 开始滑动标识符
    options?.afterTouchStart?.(e)
  }

  // 手指滑动过程中
  const handleTouchMove = (e: TouchEvent) => {
    options?.beforeTouchMove?.(e)
    if (!start.value) {
      return
    }
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    options?.afterTouchMove?.(e)
  }

  // 手指滑动结束
  const handleTouchEnd = () => {
    options?.beforeTouchEnd?.(e)
    swiping.value = false // 结束滑动标识符
    options?.afterTouchEnd?.(e)
  }
  
  onMounted(() => {
    if (!element.value) {
      return
    }
    element.value.addEventListener('touchstart', handleTouchStart)
    element.value.addEventListener('touchmove', handleTouchMove)
    element.value.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    if (!element.value) {
      return
    }
    element.value.removeEventListener('touchstart', handleTouchStart)
    element.value.removeEventListener('touchmove', handleTouchMove)
    element.value.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    distance,
    direction,
    swiping,
  }
}