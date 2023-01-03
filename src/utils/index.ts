export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null // 定时器的类型是number
  let result: ReturnType<T> | undefined // 返回函数的出参类型
  return (...args: Parameters<T>) => { // 返回函数的入参由fn的参数来推导
    if (!timer) {
      result = fn?.(...args)
      timer = setTimeout(() => {
        timer = null
      }, delay)
      return result
    }
  }
}

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null // 定时器的类型是number
  let result: ReturnType<T> | undefined // 返回函数的出参类型
  return (...args: Parameters<T>) => { // 返回函数的入参由fn的参数来推导
    if (timer) { // 每次定时器就清除
      clearTimeout(timer)
    }
    result = fn?.(...args)
    timer = setTimeout(() => {
      timer = null
    }, delay)
    return result
  }
}