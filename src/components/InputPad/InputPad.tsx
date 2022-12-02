import { defineComponent, ref, Ref } from 'vue';
import { Icon } from '../CustomIcon/Icon';
import s from './InputPad.module.scss';
import { dateFormat } from '../../utils/index'
import { Popup, DatetimePicker } from 'vant'
export const InputPad = defineComponent({
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
      { text: '清空', onClick: () => { currentAmount.value = '0' } },
      { text: '提交', onClick: () => { console.log('vv', currentAmount.value) } },
      { text: '×', onClick: () => { handleDel() } },
    ]
    const currentDate = ref(new Date())
    const datePickerVisible = ref(false)
    const currentAmount = ref('0')

    const append = (target: number | string) => {
      if (currentAmount.value.length >= 16) { // 最大输入位数16位（含小数点）
        return
      }
      const findDocIndex = currentAmount.value.indexOf('.')
      if (findDocIndex === -1 && Number(currentAmount.value) === 0 && Number(target) === 0) { // 重复0校验
        return
      }
      if (findDocIndex > -1 && target === '.') { // 重复点的校验
        return
      }
      if (currentAmount.value.length === 15 && target === '.') { //最后一位不能是点.
        return
      }
      if (findDocIndex > -1 && currentAmount.value.length - findDocIndex > 2) { //小数点后最多2位
        return
      }
      if (findDocIndex === -1 && Number(currentAmount.value) === 0 && target !== '.') { // 任意数字替换‘0’的校验
        currentAmount.value = target
        return
      }
      currentAmount.value += target
    }
    const handleDel = () => {
      if (currentAmount.value === '0') {
        return
      }
      if (currentAmount.value.length === 1) {
        currentAmount.value = '0'
        return
      }
      currentAmount.value = currentAmount.value.slice(0, currentAmount.value.length - 1)
    }
    const showDatePicker = () => {
      datePickerVisible.value = true
    }
    const hideDatePicker = () => {
      datePickerVisible.value = false
    }
    const handleConfirm = (date: Date) => {
      console.log('confirm：', dateFormat(date).format())
      // 每次保存后，更新pop选中的时间 到 currentDate
      currentDate.value = date
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
                { dateFormat(currentDate.value).format() }
              </span>
              <Popup
                get-container="body"
                position='bottom'
                show={datePickerVisible.value}
                onClickOverlay={() => datePickerVisible.value = false}
              >
                <DatetimePicker
                  value={currentDate.value}
                  type="date"
                  title="选择年月日"
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                ></DatetimePicker>
              </Popup>
            </span>
          </span>
          <span class={s.amount}>{currentAmount.value}</span>
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