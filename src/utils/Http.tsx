import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Toast } from 'vant'
import { debounce } from './index';

// message(data) 来弹出错误提示
const message = debounce((msg: string) => {
  Toast.fail(msg)
}, 800)

// 定义post/patch请求的参数中的value格式，可能为 string、boolean、number、null、数组、对象数组等
type JSONValue = string | boolean | number | null | JSONValue[] | { [key: string]: JSONValue }[]
export class Http {
  instance: AxiosInstance
  constructor(baseURL: string){
    this.instance = axios.create({
      baseURL
    })
  }
  // 封装axios - 暴露出一个Http类和一个http请求实例 - get/post/patch/destroy, 
  get<T extends any>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>) {
    return this.instance.request<T>({
      ...config,
      url,
      params: query,
      method: 'get'
    })
  }
  delete<T extends any>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>) {
    return this.instance.request<T>({
      ...config,
      url,
      params: query,
      method: 'delete'
    })
  }
  post<T extends any>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
    return this.instance.request<T>({
      ...config,
      url,
      data,
      method: 'post'
    })
  }
  patch<T extends any>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
    return this.instance.request<T>({
      ...config,
      url,
      data,
      method: 'patch'
    })
  }
}

export const http = new Http('/api/v1')

// 响应拦截
http.instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response) {
    // 根据api响应头的状态码进行提示
    message(error.response.data?.message)
    // if (error.response?.status === 429) {
    //   message(error.response.data?.message)
    // }
  }
  throw error
})

