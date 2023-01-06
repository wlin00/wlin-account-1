import { defineComponent, ref } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Tab, Tabs } from '../../../../components/Tabs/Tabs';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import { InputPad } from '../../../../components/InputPad/InputPad';
import s from './ItemCreate.module.scss';
import { useRouter } from 'vue-router';
import { ItemTags } from './components/ItemTags';

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const currentTab = ref<string>('expenses') // expenses or income
    const router = useRouter()
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
                  <ItemTags kind="expenses" />
                </Tab>
                <Tab code="income" name="收入">
                  <ItemTags kind="income" />
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