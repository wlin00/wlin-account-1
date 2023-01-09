import { defineComponent, PropType, onMounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { FloatButton } from '../../../../../components/FloatButton/FloatButton';
import s from './ItemSummary.module.scss';
import { http } from '../../../../../utils/Http';
import { Time } from '../../../../../utils/Time';
import { Item, Resources } from '../../../../../utils/types';
import { NoticeBar, Dialog, Toast } from 'vant';

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
    const startX = ref<number>(0)
    const startY = ref<number>(0)

    const handleJump = () => {
      router.push('/items/create')
    }
    const initData = async () => {
      try {
        const response = await http.get<Resources<Item>>('/items')
        const arr = response.data?.resource.map((item: Item) => ({ ...item, isTouchMove: false }))
        console.log('rrr', arr)
        list.value.push(...arr) // todo 账单记录联调

        // hasMore.value = (pager.page - 1) * pager.per_page + resource.length < pager.count // 若当前现有的标签数据条数+本次返回条数 < 总标签数量，则表示还有更多数据，展示《加载更多》按钮
        // page.value += 1
        
      } catch {}
    }
    // 初始化
    const init = async () => {
      list.value = []
      await nextTick()
      initData()
    }
    // 账单删除
    const handleItemDelete = async (item: Item) => {
      try {
        await Dialog.confirm({
          title: '是否删除账单',
          message: `确认删除当前账单？`,
        })
        await http.delete(`/items/${item.id}`)
        Toast.success('删除账单成功')
        init()
      } catch {
      }
    }
    const handleInnerTouchStart = (e: TouchEvent) => {
      e.stopPropagation()
    }
    const handleInnerTouchMove = (e: TouchEvent) => {
      e.stopPropagation()
    }
    const handleTouchStart = async (e: TouchEvent) => { // 手指滑动事件开始
      // 重置列表左滑状态
      list.value.forEach((item: Item) => {
        if (item.isTouchMove) {
          item.isTouchMove = false
        }
      })
      // 每次开始滑动，暂存当前开始的坐标
      startX.value = e.changedTouches[0].clientX
      startY.value = e.changedTouches[0].clientY
    }
    const handleTouchMove = async (e: TouchEvent, index: number) => { // 手指滑动过程
      // 获取当前滑动变化坐标
      const touchMoveX = e.changedTouches[0].clientX
      const touchMoveY = e.changedTouches[0].clientY
      // 获取滑动角度
      const angle = getAngle({X: startX.value, Y: startY.value}, {X: touchMoveX, Y: touchMoveY})
      // 更新列表的滑动状态
      list.value.forEach((item: Item, i: number) => {
        item.isTouchMove = false
        // 若滑动角度超过30deg，则视为未滑动
        if (Math.abs(angle) > 30) { return }
        if (i === index) {
          item.isTouchMove = touchMoveX <= startX.value // 若水平轴线有向左的位移 & 角度小于30度则视为左滑
        }
      })
    }
    const getAngle = (start: Record<string, number>, end: Record<string, number>) => {
      const _X = end.X - start.X
      const _Y = end.Y - start.Y
      // 通过 Math.atan() 返回角度的反正切值
      return (360 * Math.atan(_Y / _X) / (2 * Math.PI))
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
        <NoticeBar color="#1989fa" background="#ecf9ff" left-icon="info-o">
          左滑账单记录可删除~
        </NoticeBar>
        <ol class={s.list}>
          {list.value?.length ? 
            list.value.map((item: Item, index: number) => 
              (
                <li
                  onTouchstart={handleTouchStart}
                  onTouchmove={(e: TouchEvent) => handleTouchMove(e, index)}
                  class={[s.good_list, item.isTouchMove ? s.touch_move_active : '']}
                >
                  <div class={s.item_wrap}>
                    <div class={s.sign}>
                      <span>X</span>
                    </div>
                    <div class={s.text}>
                      <div class={s.tagAndAmount}>
                        <span class={s.tag}>{item.name || 'test'}</span>
                        <span class={[s.amount, item.kind === 'income' ? s.amount_income : '']}>{item.kind === 'income' ? '收入' : '支出'}￥{(item.amount / 100).toFixed(2)}</span>
                      </div>
                      <div class={s.time}>
                        { item.created_at ? new Time(new Date(item.created_at)).format() : '--' }
                      </div>
                    </div>
                  </div>
                  <div 
                    onTouchstart={handleInnerTouchStart}
                    onTouchmove={handleInnerTouchMove}
                    onClick={() => handleItemDelete(item)}
                    class={s.del}
                  >删除</div>
                </li>
              )
          ): ''}
        </ol>
        <div class={s.more}>向下滑动加载更多</div>
        <FloatButton onClick={handleJump} name='add' />
      </div>
    )
  }
})