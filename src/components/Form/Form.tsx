import { DatetimePicker, Popup } from 'vant';
import { computed, defineComponent, PropType, ref } from 'vue';
import { Time } from '../../utils/Time';
import { EmojiSelect } from '../EmojiSelect/EmojiSelect';
import s from './Form.module.scss';
export const Form = defineComponent({
  props: {
    handleSubmit: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <form class={s.form} onSubmit={props.handleSubmit}>
        { slots.default?.() }
      </form>
    )
  }
})


export const FormItem = defineComponent({
  props: {
    modelValue: {
      type: [String, Number]
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    type: {
      type: String as PropType<'text' | 'emoji' | 'date'>
    },
    errorItem: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'validate'],
  setup: (props, context) => {
    const { slots } = context
    const datePickerVisible = ref(false)
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input 
            type="text" 
            maxlength="10"
            value={props.modelValue}
            class={[s.formItem, s.input, `${props.errorItem?.length ? s.error : ''}`]}
            onInput={handleInputText}
            placeholder={props.placeholder}
          />
        case 'emoji':
          return  <EmojiSelect
            value={props.modelValue} 
            onInput={handleChangeSelect}
            class={[s.formItem, s.emojiList, `${props.errorItem?.length ? s.error : ''}`]} 
          />
        case 'date':
          return <>
            <input
              readonly={true}
              value={props.modelValue}
              class={[s.formItem, s.input]}
              placeholder={props.placeholder}
              onClick={() => { datePickerVisible.value = true }}
            />
            <Popup 
              get-container="body"
              position='bottom' 
              show={datePickerVisible.value}
              onClickOverlay={() => datePickerVisible.value = false}
            >
              <DatetimePicker 
                value={props.modelValue} 
                type="date" 
                title="选择年月日"
                onConfirm={(date: Date) => {
                  context.emit('update:modelValue', new Time(date).format())
                  context.emit('validate')
                  datePickerVisible.value = false
                }}
                onCancel={() => datePickerVisible.value = false} />
            </Popup>
          </>
        default:
          return slots.default?.()      
      }
    })
    const handleInputText = (e: any) => {
      context.emit('update:modelValue', e.target.value)
      context.emit('validate', 'name')
    }
    const handleChangeSelect = (val: any) => {
      context.emit('update:modelValue', val)
      context.emit('validate', 'emoji')
    }
    return () => (
      <div class={s.formRow}>
        <label class={s.formLabel}>
          {
            props.label && (
              <span class={s.formItem_name}>
                <span>{props.label}</span>
                { props.type === 'emoji' && <span class={s.emojiIcon}>{props.modelValue}</span>}
              </span>
            )
          }
          <div class={[s.formItem_value, `${!['text', 'emoji', 'date'].includes(props.type) ? s.formItem_default: ''}`]}>
            {content.value}
          </div>
          <div class={[s.formItem_errorHint, `${!['text', 'emoji', 'date'].includes(props.type) ? s.formItem_errorHint_none: ''}`]}>
            <span>{props.errorItem?.length ? props.errorItem?.[0] : ''}</span>
          </div>
        </label>
      </div>
    )
  }
})