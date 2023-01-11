import { defineComponent, onMounted, PropType, ref, computed } from 'vue';
import s from './PieChart.module.scss';
import * as echarts from 'echarts'
import { ItemTagSummary } from '../../../../utils/types';

export const PieChart = defineComponent({
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
      type: Array as PropType<ItemTagSummary[]>,
      default: () => []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    const chartVisible = computed(() => {
      return props.value?.length
    })
    onMounted(() => {
      if (!props.value?.length) {
        return
      }
      const data = props.value.map((item: ItemTagSummary) => ({
        value: item.amount, name: item.tags[0].name
      }))
      const dom = refDiv.value!
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(dom);
      // 绘制图表
      const option = {
        grid: [
          { left: 0, top: 0, right: 0, bottom: 20 }
        ],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    })
    return () => <>
      {
        chartVisible.value ? (<div ref={refDiv} class={s.wrapper}></div>) : (<span class={s.tip}>暂无账单数据~</span>)
      }
    </>
  }
})