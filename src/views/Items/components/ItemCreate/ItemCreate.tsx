import { defineComponent } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { Navbar } from '../../../../components/Navbar/Navbar';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import s from './ItemCreate.module.scss';

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>
        {{
          title: () => '记一笔',
          icon: () => <Icon class={s.navbar_icon} name="left" />,
          default: () => <>
            <span>123</span>
          </>
        }}
      </MainLayout>
    )
  }
})