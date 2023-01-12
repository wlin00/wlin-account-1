import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Toast } from 'vant'
import { debounce } from './index';
// import { mockSession, mockTagIndex } from './mock';
import { resetMeInfo } from './Me';

// message(data) 弹出错误提示
const message = debounce((msg: string) => {
  Toast.fail(msg)
}, 800)

function isDev() {
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    return false
  }
}

type JSONValue = string | boolean | number | null | JSONValue[] | { [key: string]: JSONValue }[] // 定义post/patch请求的参数中的value格式，可能为 string、boolean、number、null、数组、对象数组等

export class Http {
  instance: AxiosInstance
  constructor(baseURL: string){
    this.instance = axios.create({
      baseURL
    })
  }
  // 封装axios - 暴露出一个Http类和一个http请求实例 - get/post/patch/destroy, 
  get<T extends any>(url: string, query?: Record<string, string | number>, config?: any) { // Omit用于在AxiosRequestConfig类型中去除指定字段
    return this.instance.request<T>({ // 传入泛型T可定义本次请求的返回值类型
      ...config,
      url,
      params: query,
      method: 'get'
    })
  }
  delete<T extends any>(url: string, query?: Record<string, string | number>, config?: any) {
    return this.instance.request<T>({
      ...config,
      url,
      params: query,
      method: 'delete'
    })
  }
  post<T extends any>(url: string, data?: Record<string, JSONValue>, config?: any) {
    return this.instance.request<T>({
      ...config,
      url,
      data,
      method: 'post'
    })
  }
  patch<T extends any>(url: string, data?: Record<string, JSONValue>, config?: any) {
    return this.instance.request<T>({
      ...config,
      url,
      data,
      method: 'patch'
    })
  }
}

export const http = new Http(isDev() ? '/api/v1' : 'http://47.94.212.148:3000/api/v1')

// 请求拦截，登陆后响应头添加token
http.instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers!.Authorization = `Bearer ${jwt}`
  }
  console.log('auto_request', (config as any))
  if ((config as any)?._autoLoading) { // 若请求参数中有《_autoLoading》标识，则开始loading
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0
    })
  }
  return config
})

http.instance.interceptors.response.use((response: AxiosResponse) => {
  console.log('auto_response', (response.config as any))

  if ((response.config as any)?._autoLoading) {
    Toast.clear()
  }
  return response
}, (error) => {
  if (error.response?.config._autoLoading) {
    Toast.clear()
  }
  throw error
}) 

// 响应拦截，mock处理
// http.instance.interceptors.response.use((response: AxiosResponse) => { 
//   mock(response) // 若当前请求成功且非mock，则本次响应拦截return false即无效化
//   return response
// }, (error) => {
//   if (mock(error.response)) { // 若mock数据有返回值，则使用mock
//     return error.response
//   } else {
//     throw error
//   }
// })

// 响应拦截，非200状态码提示
http.instance.interceptors.response.use((response: AxiosResponse) => {
  return response
}, (error) => {
  if (error.response) {
    // 根据api响应头的状态码进行提示
    message(error.response.data?.message)
    if (error.response.status === 401) {
      resetMeInfo()
    }
  }
  throw error
})

