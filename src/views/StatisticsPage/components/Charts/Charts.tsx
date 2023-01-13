

import { defineComponent, PropType, ref, onMounted, reactive, defineAsyncComponent } from 'vue';
import s from './Charts.module.scss';
import { LineChart } from '../LineChart/LineChart';
import { PieChart } from '../PieChart/PieChart';
import { Bars } from '../Bars/Bars';
import { RadioGroup, Radio, Toast } from 'vant';
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
  emits: ['refresh'],
  setup: (props, context) => {
    const option: ChartRules<IListType> = [
      { text: '支出', value: 'expenses' },
      { text: '收入', value: 'income' },
    ]
    const currentSelect = ref<keyof IListType>('expenses')
    const loadFlag = ref<boolean>(false)
    const tagSummary = ref<ItemTagSummary[]>([])
    const dateSummary = ref<ItemDateSummary[]>([])

    // async component
    const AsyncLineChart = defineAsyncComponent({
      // 加载函数
      loader: () => import('../LineChart/LineChart'),
      // 加载异步组件时使用的组件
      // loadingComponent: LoadingComponent,
      // 展示加载组件前的延迟时间，默认为 200ms
      delay: 200,
      // 加载失败后展示的组件
      // errorComponent: ErrorComponent,
      // 如果提供了一个 timeout 时间限制，并超时了
      // 也会显示这里配置的报错组件，默认值是：Infinity
      timeout: 6000
    })
    const AsyncPieChart = defineAsyncComponent({
      // 加载函数
      loader: () => import('../PieChart/PieChart'),
      // 加载异步组件时使用的组件
      // loadingComponent: LoadingComponent,
      // 展示加载组件前的延迟时间，默认为 200ms
      delay: 200,
      // 加载失败后展示的组件
      // errorComponent: ErrorComponent,
      // 如果提供了一个 timeout 时间限制，并超时了
      // 也会显示这里配置的报错组件，默认值是：Infinity
      timeout: 6000
    })
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
        }, { _autoLoading: true })
        const resDate = await http.get<ResourceSummary<ItemDateSummary[]>>('/items/summary', {
          happened_after: props.startDate,
          happened_before: props.endDate,
          kind: currentSelect.value,
          group_by: 'happen_at',
        }, { _autoLoading: true })
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
          class={s.radio_group}
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
              <AsyncLineChart 
                value={dateSummary.value}
                style={{ marginTop: '40px' }} 
                startDate={props.startDate}
                endDate={props.endDate}
                type={currentSelect.value}
              />
              <AsyncPieChart
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