import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';
import s from './Charts.module.scss';

export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>
    },
    endDate: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const router = useRouter()

    return () => (
      <div class={s.wrapper}>
        chart
      </div>
    )
  }
})