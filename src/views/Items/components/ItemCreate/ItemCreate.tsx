import { defineComponent, ref, Ref, onMounted } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Navbar } from '../../../../components/Navbar/Navbar';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import { InputPad } from '../../../../components/InputPad/InputPad';
import s from './ItemCreate.module.scss';
import { useRouter } from 'vue-router';
import { http } from '../../../../utils/Http';
import { Button } from '../../../../components/Button/Button';
import { Resources } from '../../../../env';

type Tag = {
  id: number
  user_id: number
  name: string,
  sign: string,
  king: 'expenses' | 'income'
}

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<string>('expense') // expense or income
    const router = useRouter()
    const handleAddIcon = () => {
      router.push('/tags/create')
    }
    const refExpensesTags = ref<Tag[]>([])
    const refIncomeTags = ref<Tag[]>([])
    const refHasMore = ref(false)
    const refHasMoreIncome = ref(false)
    onMounted(async() => {
      const response = await http.get<Resources<Tag>>('/tags', {
        kind: 'expenses',
        _mock: 'tagIndex' // 加入_mock参数来让响应拦截器进行mock处理
      })
      const { resource, pager } = response.data
      refExpensesTags.value = resource
      refHasMore.value = (pager.page - 1) * pager.per_page + resource.length < pager.count

    })
    onMounted(async() => {
      const response = await http.get<{ resource: Tag[] }>('/tags', {
        kind: 'income',
        _mock: 'tagIndex' // 加入_mock参数来让响应拦截器进行mock处理
      })
      refIncomeTags.value = response.data.resource
    })
    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => '记一笔',
          icon: () => <Icon onClick={() => router.push('/items/list')} class={s.navbar_icon} name="left" />,
          default: () => <>
            <div class={s.wrapper}>
              <Tabs 
                value={currentTab.value} 
                onInput={(code: string) => currentTab.value = code}
                class={s.tabs}
              >
                <Tab code="expense" name="支出">
                  <div class={s.tags_wrapper}>
                    <div class={s.tag}>
                      <div onClick={handleAddIcon} class={s.sign}>
                        <Icon name="add" class={s.createTag} />
                      </div>
                      <div class={s.name}>新增</div>
                    </div>
                    {
                      refExpensesTags.value.map((tag: any) => (
                        <div class={[s.tag, s.selected]}>
                          <div class={s.sign}>{tag.sign}</div>
                          <div class={s.name}>{tag.name}</div>
                        </div>
                      ))
                    }
                  </div>
                  <div class={s.more}>
                    {
                      refHasMore.value ? 
                        <Button class={s.loadMore}>加载更多</Button> :
                        <span class={s.noMore}>没有更多</span>
                    }
                  </div>
                </Tab>
                <Tab code="income" name="收入">
                  <div class={s.tags_wrapper}>
                    <div class={s.tag}>
                      <div onClick={handleAddIcon} class={s.sign}>
                        <Icon name="add" class={s.createTag} />
                      </div>
                      <div class={s.name}>
                        新增
                      </div>
                    </div>
                    {
                      refIncomeTags.value.map((tag: any) => (
                        <div class={[s.tag, s.selected]}>
                          <div class={s.sign}>{tag.sign}</div>
                          <div class={s.name}>{tag.name}</div>
                        </div>
                      ))
                    }
                  </div>
                  <div class={s.more}>
                    {
                      refHasMoreIncome.value ? 
                        <Button class={s.loadMore}>加载更多</Button> :
                        <span class={s.noMore}>没有更多</span>
                    }
                  </div>
                </Tab>
              </Tabs>  
            </div>
            <div class={s.inputPad_wrapper}>
              <InputPad />
            </div>
          </>
        }}
      </MainLayout>
    )
  }
})