import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';
faker.setLocale('zh_CN')

type Mock = (config: AxiosRequestConfig) => [number, any]

// 针对不同的接口，向外暴露不同状态码和mock数据
export const mockTagIndex: Mock = (config) => { // 标签列表查询接口mock，返回标签列表数组
  const { page, kind } = config.params
  const per_page = 25
  const count = 26
  let id = 0
  const createId = () => ++id
  const createTag = (n = 1, attrs?: any) => new Array(n).fill(undefined).map(() => ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: config.params.kind,
    ...attrs
  }))
  const createPager = (page = 1) => ({
    page,
    per_page,
    count
  })
  const createBody = (n = 1, attrs?: any) => ({
    resource: createTag(n),
    pager: createPager(page)
  })
  if (kind === 'expenses' && (page === 1 || !page)) {
    return [200, createBody(25)]
  } else if (kind === 'expenses' && page === 2) {
    return [200,  createBody(1)]
  } else {
    return [200,  createBody(20)]
  }
}

export const mockSession: Mock = (config) => { // 登录接口mock
  return [
    200, {
      jwt: faker.random.word()
    }
  ]
}