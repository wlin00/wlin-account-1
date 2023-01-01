import { DatetimePicker, Popup } from 'vant';
import { computed, defineComponent, nextTick, PropType, ref, toRaw } from 'vue';
import { Time } from '../../utils/Time';
import { Button } from '../Button/Button';
import { EmojiSelect } from '../EmojiSelect/EmojiSelect';
import s from './Form.module.scss';
export const Form = defineComponent({
  props: {
    handleSubmit: {
      type: Function as PropType<() => void>
    }
  },
  emits: ['submit'],
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
    validateCode: {
      type: String
    },
    placeholder: {
      type: String
    },
    type: {
      type: String as PropType<'text' | 'emoji' | 'date' | 'validationCode' | 'select'>
    },
    errors: {
      type: Object,
      default: () => {}
    },
    errorItem: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array as PropType<{ value: string, text: string }[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'validate', 'sendValidationCode'],
  setup: (props, context) => {
    const { slots } = context
    const datePickerVisible = ref(false)
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input 
            type="text" 
            maxlength="50"
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
        case 'validationCode' :
          return <>
            <input 
              type="text"
              class={[s.formItem, s.input, s.validationCodeInput, `${props.errorItem?.length ? s.error : ''}`]}
              maxlength="10"
              placeholder={props.placeholder}
              value={props.modelValue}
              onInput={handleInputValidationCode}
            />
            <Button
              class={[s.formItem, s.button, s.validationCodeButton]}
              onClick={handleSendValidationCode}
            >发送验证码</Button>
          </> 
        case 'select':
          return <select 
            class={[s.formItem, s.select]}
            value={props.modelValue}
            onChange={(e: any) => { context.emit('update:modelValue', e.target.value) }}
          >
            { props.options?.map((option: { value: string, text: string }) => (
              <option value={option.value}>{option.text}</option>
            )) }
          </select>  
        default:
          return slots.default?.()      
      }
    })
    const handleInputText = (e: any) => {
      context.emit('update:modelValue', e.target.value)
      context.emit('validate', props.validateCode)
    }
    const handleSendValidationCode = async () => {
      context.emit('validate', 'email')
      await nextTick()
      const errors = toRaw(props.errors)
      if (errors['email']?.length) {
        return // 若当前邮箱正则校验不通过，则调用《发送验证码》接口
      }
      context.emit('sendValidationCode')
    }
    const handleInputValidationCode = (e: any) => {
      context.emit('update:modelValue', e.target.value)
      context.emit('validate', props.validateCode)
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
          <div class={[s.formItem_value, `${!['text', 'emoji', 'date', 'validationCode'].includes(props.type) ? s.formItem_default: ''}`]}>
            {content.value}
          </div>
          <div class={[s.formItem_errorHint, `${!['text', 'emoji', 'date', 'validationCode'].includes(props.type) ? s.formItem_errorHint_none: ''}`]}>
            <span>{props.errorItem?.length ? props.errorItem?.[0] : ''}</span>
          </div>
        </label>
      </div>
    )
  }
})