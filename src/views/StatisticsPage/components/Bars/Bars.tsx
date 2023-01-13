import { defineComponent, computed, PropType, reactive, onMounted } from 'vue';
import s from './Bars.module.scss';
import { ItemTagSummary } from '../../../../utils/types';

export const Bars = defineComponent({
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
    const data = props.value.map((item: ItemTagSummary) => ({
      tag: item.tags[0],
      amount: item.amount,
      id: item.tag_id
    }))
    const formatData = computed(() => {
      const total = data.reduce((sum, item) => sum + item.amount, 0)
      return data.map(item => ({
        ...item,
        percent: Math.round(item.amount / total * 100) + '%'
      }))
    })

    return () => (
      <div class={s.wrapper}>
        {formatData.value.map(({ tag, amount, percent }) => {
          return (
            <div class={s.topItem}>
              <div class={s.sign}>
                {tag.sign}
              </div>
              <div class={s.bar_wrapper}>
                <div class={s.bar_text}>
                  <span> {tag.name} - {percent} </span>
                  <span> ￥{amount} </span>
                </div>
                <div class={s.bar}>
                  <div class={s.bar_inner}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
})
export default Bars