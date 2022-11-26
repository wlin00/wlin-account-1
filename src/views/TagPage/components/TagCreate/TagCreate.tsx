import { defineComponent, PropType, reactive } from 'vue';
import { Button } from '../../../../components/Button/Button';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { EmojiSelect } from '../../../../components/EmojiSelect/EmojiSelect';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';

import s from './TagCreate.module.scss';

export const TagCreate = defineComponent({
  setup: (props, context) => {
    const formData = reactive({
      name: '', 
      emoji: '',
    })
    const handleIconClick = () => {

    }
    return () => (
      <MainLayout>{{
        title: () => '新建标签',
        icon: () => <Icon name="left" onClick={handleIconClick} />,
        default: () => (
          <form class={s.form}>
            <div class={s.formRow}>
              <label class={s.formLabel}>
                <span class={s.formItem_name}>标签名</span>
                <div class={s.formItem_value}>
                  <input type="text" v-model={formData.name} class={[s.formItem, s.input, s.error]} />
                </div>
                <div class={s.formItem_errorHint}>
                  <span>必填</span>
                </div>
              </label>
            </div>
            <div class={s.formRow}>
              <label class={s.formLabel}>
                <span class={s.formItem_name}>
                  <span>符号</span>
                  <span class={s.emojiIcon}>{formData.emoji}</span>
                </span>
                <div class={s.formItem_value}>
                  <EmojiSelect v-model={formData.emoji} class={[s.formItem, s.emojiList, s.error]} />
                </div>
                <div class={s.formItem_errorHint}>
                  <span>必填</span>
                </div>
              </label>
            </div>
            <p class={s.tips}>长按标签即可进行编辑</p>
            <div class={s.formRow}>
              <div class={s.formItem_value}>
                <Button class={[s.formItem, s.button]}>确定</Button>
              </div>
            </div>
          </form>
        )
      }}</MainLayout>
    )
  }
})