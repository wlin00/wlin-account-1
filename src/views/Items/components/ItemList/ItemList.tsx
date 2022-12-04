import { Overlay } from 'vant';
import { defineComponent, PropType, ref, Ref, reactive } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import { Time } from '../../../../utils/Time'

import s from './ItemList.module.scss';
import { ItemSummary } from './ItemSummary/ItemSummary';
export const ItemList = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<Ref<string>>('currentMonth') // currentMonth 本月 ｜ lastMonth 上月 ｜ currentYear 今年 ｜ custom 自定义
    const time = new Time()
    const customTime = reactive({
      start: new Time(),
      end: new Time(),
    })
    const timeList = [
      { start: time.firstDayofMonth(), end: time.lastDayofMonth() }, // 本月
      { start: time.add(-1, 'month').firstDayofMonth(), end: time.add(-1, 'month').lastDayofMonth() }, // 上月
      { start: time.firstDayofYear(), end: time.lastDayofYear() }, // 今年
    ]
    const refOverlayVisible = ref(false)
    const handleTabChange = (tab: string) => {
      currentTab.value = tab
      if (tab === 'custom') {
        refOverlayVisible.value = true
      }
    }

    return () => (
      <MainLayout>
        {{
          title: () => 'Wlin记账',
          icon: () => <Icon class={s.navbar_icon} name="left" />,
          default: () => (<>
            <Tabs 
              classPrefix={'customTabs'} 
              value={currentTab.value} 
              onInput={(code: string) => handleTabChange(code)}
              class={s.tabs}
            >
              <Tab name="本月" code="currentMonth">
                <ItemSummary
                  startDate={timeList[0].start.format()}
                  endDate={timeList[0].end.format()} 
                />
              </Tab>
              <Tab name="上月" code="lastMonth">
                <ItemSummary
                  startDate={timeList[1].start.format()}
                  endDate={timeList[1].end.format()} 
                />
              </Tab>
              <Tab name="今年" code="currentYear">
                <ItemSummary
                  startDate={timeList[2].start.format()}
                  endDate={timeList[2].end.format()} 
                />
              </Tab>
              <Tab name="自定义时间" code="custom">
                <ItemSummary
                  startDate={customTime.start.format()}
                  endDate={customTime.end.format()} 
                />
              </Tab>
            </Tabs>
            <Overlay show={refOverlayVisible.value} class={s.overlay} >
              <div class={s.overlay_inner}>
                <header>
                  请选择时间
                </header>
                <main>
                  <form>
                    <div>

                    </div>
                    <div>

                    </div>
                  </form>
                </main>
              </div>
            </Overlay>
          </>)
        }}
    </MainLayout>
  )}
})