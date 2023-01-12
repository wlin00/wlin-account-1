import { onMounted, ref } from 'vue';
import { Tag, Resources } from '../utils/types';
import { http } from '../utils/Http';
import { AxiosResponse } from 'axios';

// 将分页获取标签列表的业务逻辑封装成useTags hook
export const useListFetch = (promise: (page: number) => Promise<AxiosResponse<Resources<any>>>) => {
  const list = ref<Tag[]>([])
  const page = ref<number>(0)
  const hasMore = ref<boolean>(false)
  const fetch = async () => { // 接受一个page参数，下次调用时，闭包函数可以让外部读取到page这个响应式变量以便修改page
    try {
      const response = await promise(page.value)
      const { resource, pager } = response.data
      list.value.push(...resource)
      hasMore.value = (pager.page - 1) * pager.per_page + resource.length < pager.count // 若当前现有的标签数据条数+本次返回条数 < 总标签数量，则表示还有更多数据，展示《加载更多》按钮
      page.value += 1
    } catch {
      list.value = []
      hasMore.value = false
      page.value = 0
    }
  }
  onMounted(fetch) // 每个useTags hook 会在首次完成挂载后请求一次标签接口
  return {
    fetch, // 向外暴露一个拉取标签列表的方法，其分页参数每次递增
    list, // 标签列表数组ref
    page, // 当前分页页数ref
    hasMore, // 是否还有更多的标识ref，用于外部《查看更多》按钮的显隐
  }
}
