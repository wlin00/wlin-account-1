import { defineComponent, PropType, ref, Ref } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';

import s from './ItemList.module.scss';
export const ItemList = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<Ref<string>>('currentMonth') // currentMonth 本月 ｜ lastMonth 上月 ｜ currentYear 今年 ｜ custom 自定义

    return () => (
      <MainLayout>
        {{
          title: () => 'Wlin记账',
          icon: () => <Icon class={s.navbar_icon} name="left" />,
          default: () => (<>
            <Tabs 
              classPrefix={'customTabs'} 
              value={currentTab.value} 
              onInput={(code: string) => currentTab.value = code}
              class={s.tabs}
            >
              <Tab name="本月" code="currentMonth">
                list 1
              </Tab>
              <Tab name="上月" code="lastMonth">
                list 2
              </Tab>
              <Tab name="今年" code="currentYear">
                list 3
              </Tab>
              <Tab name="自定义时间" code="custom">
                list 4
            </Tab>
            </Tabs>
          </>)
        }}
    </MainLayout>
  )}
})