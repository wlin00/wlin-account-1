import { defineComponent } from 'vue';
import { TimeTabsLayout } from '../../../../layout/TimeTabsLayout/TimeTabsLayout';
import { ItemSummary } from './ItemSummary/ItemSummary'
import s from './ItemList.module.scss';

// 使用tabs-layout容器，传入对应的每个tab的内容组件即可，tabs本身的样式和功能都封装在《TimeTabsLayout》内
export const ItemList = defineComponent({
  setup: (props, context) => {
    return () => (
      <TimeTabsLayout component={ItemSummary} />
  )}
})