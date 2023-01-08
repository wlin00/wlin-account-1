import { defineComponent, PropType, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FloatButton } from '../../../../../components/FloatButton/FloatButton';
import s from './ItemSummary.module.scss';
import { http } from '../../../../../utils/Http';
import { Time } from '../../../../../utils/Time';
import { Item, Resources } from '../../../../../utils/types';

export const ItemSummary = defineComponent({
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
    const router = useRouter()
    const list = ref<Item[]>([])

    const handleJump = () => {
      router.push('/items/create')
    }
    const initData = async () => {
      try {
        const response = await http.get<Resources<Item>>('/items')
        const arr = response.data?.resource
        console.log('rrr', arr)
        list.value.push(...arr) // todo 账单记录联调

        // hasMore.value = (pager.page - 1) * pager.per_page + resource.length < pager.count // 若当前现有的标签数据条数+本次返回条数 < 总标签数量，则表示还有更多数据，展示《加载更多》按钮
        // page.value += 1
        
      } catch {}
    }
    const init = async () => {
      initData()
    }
    onMounted(() => {
      init()
    })

    return () => (
      <div class={s.wrapper}>
        <ul class={s.total}>
          <li><span>收入</span><span>128</span></li>
          <li><span>支出</span><span>99</span></li>
          <li><span>净收入</span><span>39</span></li>
        </ul>
        <ol class={s.list}>
          {list.value?.length ? 
            list.value.map((item: any) => 
              (<li>
                <div class={s.sign}>
                  <span>X</span>
                </div>
                <div class={s.text}>
                  <div class={s.tagAndAmount}>
                    <span class={s.tag}>{item.name || 'test'}</span>
                    <span class={s.amount}>￥{(item.amount / 100).toFixed(2)}</span>
                  </div>
                  <div class={s.time}>
                    { item.created_at ? new Time(new Date(item.created_at)).format() : '--' }
                  </div>
                </div>
            </li>)
          ): ''}
        </ol>
        <div class={s.more}>向下滑动加载更多</div>
        <FloatButton onClick={handleJump} name='add' />
      </div>
    )
  }
})