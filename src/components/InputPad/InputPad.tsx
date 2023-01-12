import { defineComponent, ref, Ref } from 'vue';
import { Icon } from '../CustomIcon/Icon';
import s from './InputPad.module.scss';
import { Time } from '../../utils/Time'
import { Popup, DatetimePicker } from 'vant'
export const InputPad = defineComponent({
  props: {
    date: {
      type: Date,
    },
    amount: {
      type: String,
      default: '0'
    }
  },
  emits: ['submit', 'update:date', 'update:amount'],
  setup: (props, context) => {
    const buttons = [
      { text: '1', onClick: () => { append('1') } },
      { text: '2', onClick: () => { append('2') } },
      { text: '3', onClick: () => { append('3') } },
      { text: '4', onClick: () => { append('4') } },
      { text: '5', onClick: () => { append('5') } },
      { text: '6', onClick: () => { append('6') } },
      { text: '7', onClick: () => { append('7') } },
      { text: '8', onClick: () => { append('8') } },
      { text: '9', onClick: () => { append('9') } },
      { text: '.', onClick: () => { append('.') } },
      { text: '0', onClick: () => { append('0') } },
      { text: '清空', onClick: () => { context.emit('update:amount', '0') } },
      { text: '提交', onClick: () => { handleSubmit() } },
      { text: '×', onClick: () => { handleDel() } },
    ]
    const datePickerVisible = ref(false)
    const handleSubmit = () => {
      context.emit('submit')
    }

    const append = (target: number | string) => {
      if (props.amount.length >= 7) { // 最大输入位数9位（含小数点）
        return
      }
      const findDocIndex = props.amount.indexOf('.')
      if (findDocIndex === -1 && Number(props.amount) === 0 && Number(target) === 0) { // 重复0校验
        return
      }
      if (findDocIndex > -1 && target === '.') { // 重复点的校验
        return
      }
      if (props.amount.length === 6 && target === '.') { //最后一位不能是点.
        return
      }
      if (findDocIndex > -1 && props.amount.length - findDocIndex > 2) { //小数点后最多2位
        return
      }
      if (findDocIndex === -1 && Number(props.amount) === 0 && target !== '.') { // 任意数字替换‘0’的校验
        context.emit('update:amount', target)
        return
      }
      context.emit('update:amount', props.amount + target)
    }
    const handleDel = () => {
      if (props.amount === '0') {
        return
      }
      if (props.amount.length === 1) {
        context.emit('update:amount', '0')
        return
      }
      context.emit('update:amount', props.amount.slice(0, props.amount.length - 1))
    }
    const showDatePicker = () => {
      datePickerVisible.value = true
    }
    const hideDatePicker = () => {
      datePickerVisible.value = false
    }
    const handleConfirm = (date: Date) => {
      // 每次保存后，更新pop选中的时间 到 currentDate
      context.emit('update:date', date)
      hideDatePicker()
    }
    const handleCancel = () => {
      hideDatePicker()
    }

    return () => (
      <>
        <div class={s.dateAndAmount}>
          <span class={s.date}>
            <Icon name="date" class={s.icon}></Icon>
            <span>
              <span onClick={showDatePicker}>
                { new Time(props.date).format() }
              </span>
              <Popup
                get-container="body"
                position='bottom'
                show={datePickerVisible.value}
                onClickOverlay={() => datePickerVisible.value = false}
              >
                <DatetimePicker
                  modelValue={props.date ? new Date(props.date) : new Date()}
                  type="date"
                  title="选择年月日"
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                ></DatetimePicker>
              </Popup>
            </span>
          </span>
          <span class={s.amount}>{props.amount}</span>
        </div>
        <div class={s.buttons}>
          {
            buttons.map((button: any) => (
              <button 
                onClick={button.onClick}
              >
                { button.text }
              </button>
            ))
          }
        </div>
      </>
    )
  }
})