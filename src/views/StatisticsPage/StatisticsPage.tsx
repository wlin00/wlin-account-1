import { defineComponent } from 'vue';
import { TimeTabsLayout } from '../../layout/TimeTabsLayout/TimeTabsLayout';
import { Charts } from './components/Charts/Charts';
import s from './ItemList.module.scss';
export const StatisticsPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <TimeTabsLayout component={Charts} />
    )
  }
})