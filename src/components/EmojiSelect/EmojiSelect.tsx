import { defineComponent, ref, onMounted, computed } from 'vue';
import s from './EmojiSelect.module.scss';
import { emojiList } from './emojiList'
export const EmojiSelect = defineComponent({
  props: {
    modelValue: {
      type: String
    }
  },
  setup: (props, context) => {
    const currentSelect = ref(0) // 当前选中的tab下标
    const tableData: [string, string[]][] = [ // 导航数据初始化
      ['表情', ['face-smiling', 'face-affection', 'face-tongue', 'face-hand',
        'face-neutral-skeptical', 'face-sleepy', 'face-unwell', 'face-hat',
        'face-glasses', 'face-concerned', 'face-negative', 'face-costume'
      ]],
      ['手势', ['hand-fingers-open', 'hand-fingers-partial', 'hand-single-finger',
        'hand-fingers-closed', 'hands', 'hand-prop', 'body-parts']],
      ['人物', ['person', 'person-gesture', 'person-role', 'person-fantasy',
        'person-activity', 'person-sport', 'person-resting']],
      ['衣服', ['clothing']],
      ['动物', ['cat-face', 'monkey-face', 'animal-mammal', 'animal-bird',
        'animal-amphibian', 'animal-reptile', 'animal-marine', 'animal-bug']],
      ['植物', ['plant-flower', 'plant-other']],
      ['自然', ['sky & weather', 'science']],
      ['食物', [
        'food-fruit', 'food-vegetable', 'food-prepared', 'food-asian',
        'food-marine', 'food-sweet'
      ]],
      ['运动', ['sport', 'game']],
    ]

    const currentEmojiList = computed(() => { // 渲染当前选中导航tab下的emoji列表，拿emoji的对应id去全量emoji库中匹配
      // 先获取当前tab对应的emojiCodeList
      const currentTabCodes = tableData?.[currentSelect.value]?.[1]
      // 在全量emojiList中映射出emoji，并用li标签渲染
      return currentTabCodes.map((tabCode: string) => {
        const findEmojiList =  emojiList.find((item: any) => item[0] === tabCode)?.[1] // 获取unicode列表
        const res = findEmojiList?.map((item: any) => ( // 渲染当前层的unicode - emoji表情
          <li 
            class={item === props.modelValue ? s.selecteEmoji: ''}
            onClick={() => handleEmojiClick(item)}
          >
            {item}
          </li>
        ))
        return res
      })
    })

    const handleEmojiClick = (emoji: string) => {
      context.emit('update:modelValue', emoji)
    }

    const handleTabClick = (index: number) => {
      if (index === currentSelect.value) {
        return
      }
      currentSelect.value = index
    }

    onMounted(() => {
    })
    
    return () => (
      <div class={s.emojiList}>
        {/* 导航区域 */}
        <nav>
          {
            tableData.map((item: any, index: number) => (
              <span
                class={index === currentSelect.value ? s.selected : ''}
                onClick={() => handleTabClick(index) }
              >
                { item[0] }
              </span>
            ))
          }
        </nav>
        {/* 当前导航下的emoji列表 */}
        <ol>{currentEmojiList.value}</ol>
      </div>
    )
  }
})