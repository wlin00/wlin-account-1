

import { defineComponent, PropType, ref } from 'vue';
import { FormItem } from '../../../../components/Form/Form';
import s from './Charts.module.scss';
import { LineChart } from '../LineChart/LineChart';
import { PieChart } from '../PieChart/PieChart';
import { Bars } from '../Bars/Bars';

export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup: (props, context) => {
    const currentSelect = ref('expenses')

    return () => (
      <div class={s.wrapper}>
        <FormItem label='类型' type="select" options={[
          { value: 'expenses', text: '支出' },
          { value: 'income', text: '收入' }
        ]} v-model={currentSelect.value} />
        <LineChart style={{ marginTop: '40px' }} />
        <PieChart />
        <Bars />
      </div>
    )
  }
})