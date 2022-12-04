/* 
  example
  import { Time } from 'shared/time';
  const time = new Time();
  time.format('YYYY-MM-DD');
  time.firstDayOfMonth();
  time.firstDayOfYear();
  time.lastDayOfMonth();
  time.lastDayOfYear();
  time.add(1, 'month');
*/
export class Time {
  date: Date
  constructor(date = new Date) {
    this.date = date
  }
  format(pattern: string = 'YYYY-MM-DD') {
    // 时间转化方法：目前支持的格式有 YYYY MM DD HH mm ss SSS
    const year = this.date.getFullYear().toString()
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0') // 若字符串长度小于2，前置补'0'
    const day = this.date.getDate().toString().padStart(2, '0')
    const hour = this.date.getHours().toString().padStart(2, '0')
    const minute = this.date.getMinutes().toString().padStart(2, '0')
    const sceond = this.date.getSeconds().toString().padStart(2, '0')
    const msceond = this.date.getMilliseconds().toString().padStart(3, '0')
    return pattern.replace(/YYYY/g, year)
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/hh/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, sceond)
    .replace(/SSS/g, msceond)
  }
  firstDayofMonth() { // 获取这个月的第一天 - 即获取date对象的今年 + 这个月，然后天数设置设置为1（若为0则代表上个月最后一天，因时间左闭右开）
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0))
  }
  firstDayofYear() { // 获取今年第一个月的第一天，因 date.getMonth() 第一位下标从0开始，所以参数2写成0
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0))
  }
  lastDayofMonth() { // 获取这个月最后一天，即下个月第0天
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0))
  }
  lastDayofYear() { // 获取今年最后一天，即明年第0天
    return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0))
  }
  getRaw() {
    return this.date
  }
  // time.add(1, 'month') -> 返回一个修改操作后的新Time对象
  add(amount: number, unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond') {
    let date = new Date(this.date.getTime())
    switch (unit) {
      case 'year':
        const currentDate = date.getDate()
        date.setDate(1)
        date.setFullYear(date.getFullYear() + amount)
        const targetDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          0,
          0,
          0,
        ).getDate()
        date.setDate(Math.min(currentDate, targetDate))  
        break;
      case 'month':
        const d1 = date.getDate()
        date.setDate(1)
        date.setMonth(date.getMonth() + amount)
        const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0).getDate()
        // 考虑到2月可能为28 29天，小于30和31天，那么在这种特殊情况，应只追加相对较小的天数
        date.setDate(Math.min(d1, d2))
        break;
      case 'day':
        date.setDate(date.getDate() + amount) // 天数上增加amount数量   
        break;
      case 'hour':
        date.setDate(date.getHours() + amount) // 天数上增加amount数量   
        break;
      case 'minute':
        date.setDate(date.getMinutes() + amount) // 天数上增加amount数量   
        break;
      case 'second':
        date.setDate(date.getSeconds() + amount) // 天数上增加amount数量   
        break;  
      case 'millisecond':
        date.setMilliseconds(date.getMilliseconds() + amount)  
        break;
      default:
        throw new Error('Time.add: unknow unit')  
    }
    return new Time(date)
  }

  
}