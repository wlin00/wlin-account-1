import { onMounted, onUnmounted, ref } from 'vue'
// 参数1: 倒计时时间， 默认值为60秒
// 参数2: manually 是否手动触发倒计时，默认为false
function useCountDown (seconds: number = 60, manually?: boolean) {
  const timer = ref<number>() // 定时器的返回值是number类型
  const count = ref<number>(seconds)
  const pending = ref<boolean>(false)

  const startCountDown = () => {
    pending.value = true
    timer.value = setTimeout(() => {
      clearTimeout(timer.value)
      if (count.value > 1) {
        count.value -= 1
        startCountDown() // 定时器正常减少，递归模拟setInterval
      } else {
        // 定时器数到1，重置count秒数，并关闭pending状态，解放按钮的禁用限制
        count.value = seconds
        pending.value = false
      }
    }, 1000)
  }

  onMounted(() => {
    !manually && startCountDown()
  })

  onUnmounted(() => {
    clearTimeout(timer.value)
  })

  return {
    count,
    pending,
    startCountDown
  }
}

export default useCountDown