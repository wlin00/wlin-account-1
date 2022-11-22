import { defineComponent, ref, Ref } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Navbar } from '../../../../components/Navbar/Navbar';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import s from './ItemCreate.module.scss';

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<Ref<string>>('expense') // expense or income
    const tabArr = [
      { name: '支出', code: 'expense' }, 
      { name: '收入', code: 'income' }, 
    ]
    return () => (
      <MainLayout>
        {{
          title: () => '记一笔',
          icon: () => <Icon class={s.navbar_icon} name="left" />,
          default: () => <>
            <Tabs value={currentTab.value} onInput={(code: string) => currentTab.value = code}>
              <Tab code="expense" name="支出">
                <span>123</span>
              </Tab>
              <Tab code="income" name="收入">
                <span>456</span>
              </Tab>
            </Tabs>
          </>
        }}
      </MainLayout>
    )
  }
})