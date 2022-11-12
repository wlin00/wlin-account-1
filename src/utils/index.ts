export const throttle = (fn: Function, delay: number) => {
  let timer: number | null = null // 定时器的类型是number
  return (...args: any[]) => {
    if (!timer) {
      fn?.(...args)
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
  }
}