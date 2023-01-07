import { defineComponent } from 'vue';
import s from './ItemTags.module.scss';
import { useRouter } from 'vue-router';
import { Icon } from '../../../../../components/CustomIcon/Icon';
import { useTags } from '../../../../../hooks/useTags';
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
    }
  },
  emits: ['update:modelValue'],
  setup: (props, context) => {
    const router = useRouter()
    const handleAddIcon = () => {
      router.push('/tags/create')
    }
    // Tags列表分页查询相关逻辑 - 使用useTags自定义hook
    const {
      fetch,
      list,
      hasMore,
    } = useTags((page: number) => http.get<Resources<Tag>>('/tags', {
      kind: props.kind,
      page: Number(page) + 1,
      _mock: 'tagIndex', // 加入_mock参数来让响应拦截器进行mock处理
    }))
    const handleTagClick = (tag: Tag):void => {
      context.emit('update:modelValue', tag.id)
    }

    return () => (
      <>
        <div class={s.tags_wrapper}>
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