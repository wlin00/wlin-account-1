import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import { InputPad } from '../../../../components/InputPad/InputPad';
import s from './ItemCreate.module.scss';
import { useRouter } from 'vue-router';
import { ItemTags } from './components/ItemTags';
import { Toast } from 'vant'
import { http } from '../../../../utils/Http';
import { NoticeBar } from 'vant';
import { Resource, Item } from '../../../../utils/types';

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<string>('expenses') // expenses or income
    const currentSelectTag = ref<number>() // 当前账单选中的标签
    const router = useRouter()
    const currentDate = ref(new Date())
    const currentAmount = ref('0')
    const isEdit = ref<boolean>(false)
    const currentId = ref<string>('')
    const loadFlag = ref<boolean>(false)

    const handleSubmit = async () => {
      // 创建账单记录 - 前置非空校验
      if (!currentSelectTag.value) {
        Toast.fail('请选择账单标签')
        return
      }
      if (!currentDate.value) {
        Toast.fail('请选择账单时间')
        return
      }
      if (!currentAmount.value || currentAmount.value === '0') {
        Toast.fail('请输入账单金额')
        return
      }
      const params = {
        kind: currentTab.value,
        tags_id: [currentSelectTag.value],
        amount: Number((parseFloat(currentAmount.value) * 100).toFixed()),
        happen_at: currentDate.value.toISOString(),
      }
      if (!isEdit.value) {
        await http.post('/items', params, { _autoLoading: true })
      } else {
        await http.patch(`/items/${currentId.value}`, params, { _autoLoading: true })
      }
      Toast.success(`${!isEdit.value ? '创建' : '编辑'}成功`)
      setTimeout(() => {
        router.push('/items/list')
      }, 300)
    }

    const init = async () => {
      const id = router.currentRoute.value.query?.id
      if (id) {
        isEdit.value = true
        currentId.value = String(id)
        initData()
      }
      await nextTick()
      loadFlag.value = true
    }

    const initData = async () => {
      try {
        const res = await http.get<Resource<Item & { happen_at: string }>>(`/items/${currentId.value}`, undefined, { _autoLoading: true })
        const resource = res.data.resource
        console.log('rrr - detail', resource)
        currentTab.value = resource.kind
        currentSelectTag.value = resource.tags_id?.[0]
        currentAmount.value = amountFormat(resource.amount)
        currentDate.value = new Date(resource.happen_at)
      } catch {
      }
    }

    const amountFormat = (amount: number): string => {
      if (!amount) {
        return '0'
      }
      const str = (parseFloat(String(amount)) / 100).toFixed(2)
      const strEnd = str.slice(-3)
      return strEnd === '.00' ? str.slice(0, str.length - 3) : str
    }

    onMounted(() => {
      init()
    })

    return () => (
      <MainLayout class={s.layout}>
        {{
          title: () => '记一笔',
          icon: () => <Icon onClick={() => router.push('/items/list')} class={s.navbar_icon} name="left" />,
          default: () => <>
            {
              loadFlag.value && <>
                <div class={s.wrapper}>
                  <Tabs 
                    value={currentTab.value} 
                    onInput={(code: string) => currentTab.value = code}
                    class={s.tabs}
                  >
                    <Tab code="expenses" name="支出">
                      <NoticeBar color="#1989fa" background="#ecf9ff" left-icon="info-o">
                        长按标签可进行编辑或删除~
                      </NoticeBar>
                      <ItemTags 
                        kind="expenses"
                        currentTab={currentTab.value}
                        v-model={currentSelectTag.value}
                      />
                    </Tab>
                    <Tab code="income" name="收入">
                      <NoticeBar color="#1989fa" background="#ecf9ff" left-icon="info-o">
                        长按标签可进行编辑或删除~
                      </NoticeBar>
                      <ItemTags
                      kind="income"
                      currentTab={currentTab.value}
                      v-model={currentSelectTag.value}
                      />
                    </Tab>
                  </Tabs>  
                </div>
                <div class={s.inputPad_wrapper}>
                  <InputPad 
                    onSubmit={handleSubmit}
                    v-model:date={currentDate.value}
                    v-model:amount={currentAmount.value}

                  />
                </div>
              </>
            }
        
          </>
        }}
      </MainLayout>
    )
  }
})