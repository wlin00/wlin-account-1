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

export const dateFormat = (date = new Date()) => { // 调用时间转化函数：dateFormat(date).format('YYYY-MM-DD hh:mm:ss')
  const api = {
    format: (pattern: string = 'YYYY-MM-DD') => {
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 若字符串长度小于2，前置补'0'
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const sceond = date.getSeconds().toString().padStart(2, '0')
      const msceond = date.getMilliseconds().toString().padStart(3, '0')
      return pattern.replace(/YYYY/g, year)
        .replace(/MM/g, month)
        .replace(/DD/g, day)
        .replace(/hh/g, hour)
        .replace(/mm/g, minute)
        .replace(/ss/g, sceond)
        .replace(/SSS/g, msceond)
    }
  }
  return api
}