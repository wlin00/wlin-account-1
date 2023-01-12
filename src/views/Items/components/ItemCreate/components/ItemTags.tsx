import { defineComponent, ref } from 'vue';
import s from './ItemTags.module.scss';
import { useRouter } from 'vue-router';
import { Icon } from '../../../../../components/CustomIcon/Icon';
import { useListFetch } from '../../../../../hooks/useListFetch';
import { http } from '../../../../../utils/Http';
import { Resources, Tag } from '../../../../../utils/types';
import { Button } from '../../../../../components/Button/Button';

export const ItemTags = defineComponent({
  props: {
    kind: {
      type: String,
      default: 'expenses'
    },
    modelValue: {
      type: [String, Number]
    },
    currentTab: {
      type: String,
      default: 'expenses'
    }
  },
  emits: ['update:modelValue'],
  setup: (props, context) => {
    const router = useRouter()
    const timer = ref<number>() // 定时器实例
    const currentTag = ref<HTMLDivElement>()
    const handleAddIcon = () => {
      router.push({
        path: '/tags/create',
        query: {
          kind: props.currentTab
        }
      })
    }

    // hook
    const { // Tags列表分页查询相关逻辑 - 使用useListFetch自定义hook 复用h5分页列表业务逻辑
      fetch,
      list,
      hasMore,
    } = useListFetch((page: number) => http.get<Resources<Tag>>('/tags', {
      kind: props.kind,
      page: Number(page) + 1,
      // _mock: 'tagIndex', // 加入_mock参数来让响应拦截器进行mock处理
    }, { _autoLoading: true }))

    // method
    const handleTagClick = (tag: Tag):void => {
      context.emit('update:modelValue', tag.id)
    }

    const handleJump = (tag: Tag) => {
      router.push({
        path: '/tags/create',
        query: {
          kind: props.currentTab,
          id: tag.id
        }
      })
    }

    const handleTouchStart = (e: Event, tag: Tag) => {
      // 触碰标签开始，执行两件事：
      // 1、记录当前长按的标签Dom
      currentTag.value = e.currentTarget as HTMLDivElement
      // 2、启动一个定时器（推入一个事件进入宏任务异步队列），0.5s后执行《长按编辑事件》；
      timer.value = setTimeout(() => { // 若用户取消触碰 或者当前手指在指定时间内移除标签，则clearTimeout
        handleJump(tag)
      }, 500)
    }

    const handleTouchEnd = () => {
      clearTimeout(timer.value)
      timer.value = undefined
      currentTag.value = undefined
    }

    const handleTouchMove = (e: TouchEvent) => { 
      // 监听手指的移动，使用《document.elementFromPoint》获取当前手指所在Dom元素；
      const pointElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
      // 判断它是否是当前记录的currentTag， 或者在这个记录Dom范围内; 若不是，则clearTimeout销毁定时器，来阻止长按事件
      if (currentTag.value !== pointElement && !currentTag.value?.contains(pointElement)) {
        clearTimeout(timer.value)
        timer.value = undefined
        currentTag.value = undefined
      }
    }

    return () => (
      <>
        <div class={s.tags_wrapper} onTouchmove={handleTouchMove}>
          <div class={s.tag}>
            <div onClick={handleAddIcon} class={s.sign}>
              <Icon name="add" class={s.createTag} />
            </div>
            <div class={s.name}>新增</div>
          </div>
          {
            list.value.map((tag: Tag) => (
              <div 
                class={[s.tag, props.modelValue === tag.id ? s.selected : '']}
                onClick={() => handleTagClick(tag)}
                onTouchstart={(e: TouchEvent) => handleTouchStart(e, tag)}
                onTouchend={handleTouchEnd}
              >
                <div class={s.sign}>{tag.sign}</div>
                <div class={s.name}>{tag.name}</div>
              </div>
            ))
          }
        </div>
        <div class={s.more}>
          {
            hasMore.value ? 
              <Button onClick={fetch} class={s.loadMore}>加载更多</Button> :
              <span class={s.noMore}>没有更多</span>
          }
        </div>
      </>
    )
  }
})