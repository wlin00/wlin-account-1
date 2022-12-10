

import { defineComponent, PropType, ref } from 'vue';
import { FormItem } from '../../../../components/Form/Form';
import s from './Charts.module.scss';
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
      </div>
    )
  }
})