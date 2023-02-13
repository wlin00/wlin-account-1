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

export function formatThousands (target: string | number): string | number {
  if (!target || target.toString().includes('%')) {
    return target
  }
  // 接收string / number类型的参数进行千分位转换
  const reg = /\d{1,3}(?=(\d{3})+$)/g
  // 正则表达式 \d{1,3}(?=(\d{3})+$)  表示前面有1~3个数字，后面的至少由一组3个数字结尾
  // ?=表示正向引用，可以作为匹配的条件，但匹配到的内容不获取，并且作为下一次查询的开始
  // $& 表示与正则表达式相匹配的内容
  const arr = target && target.toString().split('.')
  // 若存在小数点，将小数点前面的数字添加分隔符
  if (arr && arr.length) {
    arr[0] = arr[0].replace(reg, '$&,')
  }
  return arr && arr.join('.')
}