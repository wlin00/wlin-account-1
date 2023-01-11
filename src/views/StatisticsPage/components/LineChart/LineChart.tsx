import { defineComponent, onMounted, PropType, ref, computed } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts'
import { ItemDateSummary } from '../../../../utils/types';

export const LineChart = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    },
    type: {
      type: String as PropType<'expenses' | 'income'>
    },
    value: {
      type: Array as PropType<ItemDateSummary[]>,
      default: () => []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    const chartVisible = computed(() => {
      return props.value?.length
    })
    const xData = props.value.map((item: ItemDateSummary) => item.happen_at)
    const yData = props.value.map((item: ItemDateSummary) => item.amount)
    onMounted(() => {
      if (!chartVisible.value) {
        return
      }
      const dom = refDiv.value!
      // 初始化echarts实例
      let myChart = echarts.init(dom)
      // 绘制图表
      myChart.setOption({
        grid: [
          { left: 0, top: 0, right: 0, bottom: 20 }
        ],
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      })
    })
    return () => <>{
      chartVisible.value ? (<div ref={refDiv} class={s.wrapper}></div>) : (<span></span>)
    }</>
  }
})