// 自行封装表单校验方法
export type Rule<T> = {
  key: keyof T // 当前校验规则的key - 使用泛型限制key约束在当前表单formData的范围内
  message: string // 当前校验规则提示语
} & (
  { type: 'required' } |
  { type: 'pattern'
    regex: RegExp 
  }
)
export type Rules<T> = Rule<T>[]

// 表单接口类型
export interface IFormData {
  [key: string]: null | undefined | string | number | IFormData
}

// 表单错误类型
export type FormError<T> = { // { key1: ['errorTip'], key2: ['err']}
  [key in keyof T]?: string[]
}

export const validate = <T extends IFormData>(formData: T, rules: Rules<T>) => {
  // 表单校验方法，返回校验后的错误对象
  // 若为{ key: [] }则没有错误；若key对应的value数组长度>0则表示有错误
  const validateError: FormError<T> = {}
  rules.map((rule: Rule<T>) => {
    const { key, message, type } = rule
    const value = formData[key] // 获取对应formItem的value
    switch (type) {
      case 'required': // 必填型校验
        if (value === null || value === undefined || value === '') {
          if (!validateError[key]) {
            validateError[key] = []
          }
          validateError[key]?.push(message)
        }
        break;
      case 'pattern': // 正则匹配型校验
        const regex = (rule as Rule<T> & { regex: RegExp }).regex
        if (value && !regex.test(value.toString())) {
          if (!validateError[key]) {
            validateError[key] = []
          }
          validateError[key]?.push(message)
        }
        break;
      default:
        return
    }
  })
  return validateError
}