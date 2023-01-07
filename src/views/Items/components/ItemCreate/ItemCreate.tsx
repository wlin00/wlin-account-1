import { defineComponent, ref } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import { InputPad } from '../../../../components/InputPad/InputPad';
import s from './ItemCreate.module.scss';
import { useRouter } from 'vue-router';
import { ItemTags } from './components/ItemTags';
import { Toast } from 'vant'
import { http } from '../../../../utils/Http';

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<string>('expenses') // expenses or income
    const currentSelectTag = ref<number>() // 当前账单选中的标签
    const router = useRouter()
    const currentDate = ref(new Date())
    const currentAmount = ref('0')

    const handleSubmit = async () => {
      console.log('tab', currentTab.value)
      console.log('select - tag', currentSelectTag.value)
      console.log('date', currentDate.value)
      console.log('amount', currentAmount.value)
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
      console.log('ppp', params)
      await http.post('/items', params)
      Toast.success('创建成功')
      setTimeout(() => {
        router.push('/items/list')
      }, 500)
    }

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
                <Tab code="expenses" name="支出">
                  <ItemTags 
                    kind="expenses"
                    v-model={currentSelectTag.value}
                  />
                </Tab>
                <Tab code="income" name="收入">
                  <ItemTags
                   kind="income"
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
        }}
      </MainLayout>
    )
  }
})