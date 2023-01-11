

import { defineComponent, PropType, ref, onMounted, reactive } from 'vue';
import s from './Charts.module.scss';
import { LineChart } from '../LineChart/LineChart';
import { PieChart } from '../PieChart/PieChart';
import { Bars } from '../Bars/Bars';
import { RadioGroup, Radio } from 'vant'
import { http } from '../../../../utils/Http';
import { ItemTagSummary, ItemDateSummary, ResourceSummary } from '../../../../utils/types';
interface IListType {
  expenses: string
  income: string
}
type ChartRules<T> = ChartRule<T>[]
type ChartRule<T> = {
  value: keyof T
  text: string,
}

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
    const option: ChartRules<IListType> = [
      { text: '支出', value: 'expenses' },
      { text: '收入', value: 'income' },
    ]
    const currentSelect = ref<keyof IListType>('expenses')
    const loadFlag = ref<boolean>(false)
    const tagSummary = ref<ItemTagSummary[]>([])
    const dateSummary = ref<ItemDateSummary[]>([])

    const handleRadioChange = (e: Event) => {
      loadFlag.value = false
      init()
    }

    const init = async () => {
      try {
        const resTag = await http.get<ResourceSummary<ItemTagSummary[]>>('/items/summary', {
          happened_after: props.startDate,
          happened_before: props.endDate,
          kind: currentSelect.value,
          group_by: 'tag_id',
        })
        const resDate = await http.get<ResourceSummary<ItemDateSummary[]>>('/items/summary', {
          happened_after: props.startDate,
          happened_before: props.endDate,
          kind: currentSelect.value,
          group_by: 'happen_at',
        })
        tagSummary.value = resTag.data.groups
        dateSummary.value = resDate.data.groups
        loadFlag.value = true
      } catch {
        loadFlag.value = true
      }
    }

    onMounted(() => {
      init()
    })
    
    return () => (
      <div class={s.wrapper}>
        <RadioGroup 
          v-model={currentSelect.value} 
          direction="horizontal"
          onChange={handleRadioChange}
        >
          {
            option.map((item: ChartRule<IListType>) => (
              <Radio name={item.value}>{item.text}</Radio>
            ))
          }
        </RadioGroup>
        {
          loadFlag.value 
          ? (<>
              <LineChart 
                value={dateSummary.value}
                style={{ marginTop: '40px' }} 
                startDate={props.startDate}
                endDate={props.endDate}
                type={currentSelect.value}
              />
              <PieChart
                value={tagSummary.value}
                startDate={props.startDate}
                endDate={props.endDate}
                type={currentSelect.value}
              />
              <Bars
                value={tagSummary.value}
                startDate={props.startDate}
                endDate={props.endDate}
                type={currentSelect.value}
              />
            </>) 
          : (<span></span>)
        }

      </div>
    )
  }
})