import { defineComponent, PropType, reactive, toRaw } from 'vue';
import { Button } from '../../../../components/Button/Button';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { EmojiSelect } from '../../../../components/EmojiSelect/EmojiSelect';
import { Form, FormItem } from '../../../../components/Form/Form';
import { Rules, validate, FormError, Rule } from '../../../../utils/validate';
import s from './TagForm.module.scss';

type FormData = {
  name: string
  emoji: string
}

export const TagForm = defineComponent({
  setup: (props, context) => {
    // ref
    const formData = reactive<FormData>({
      name: '', 
      emoji: '',
    })
    const errors = reactive<FormError<FormData>>({
      // 当前表单的错误类型默认为,key为string & value为string[]的对象
      name: [],
      emoji: []
    })
    const rules: Rules<FormData> = [
      { key: 'name', type: 'required', message: '请输入标签名' },
      { key: 'name', type: 'pattern', message: '标签名称长度不大于5', regex: /^.{1,5}$/ },
      { key: 'emoji', type: 'required', message: '请选择符号' },
    ]

    // methods
    const handleSubmit = (e: Event) => { // 表单提交 & 手写表单校验
      e.preventDefault()
      // 调用表单校验方法
      handleFormCheck()
      console.log('error', toRaw(errors))
    }

    const handleFormCheck = (validateField?: keyof FormData) => { //可传入validateField进行局部校验，并限制局部校验key约束在FormData的联合类型范围内
      if (!validateField) { // 若进行全量表单校验
        // 每次提交前清空表单校验
        Object.assign(errors, {
          name: [],
          emoji: [],
        })
        Object.assign(errors, validate(formData, rules)) // 将当前表单校验结果同步给errors对象
      } else { // 若进行局部表单校验
        // 清空当前错误对象的局部key对应值
        Object.assign(errors, {...errors, [`${validateField}`]: []})
        // 获取需要局部校验的规则
        const filterRules: Rules<FormData> = rules.filter((item: Rule<FormData>) => item.key === validateField)
        Object.assign(errors, {...errors, [`${validateField}`]: validate(formData, filterRules)[validateField] })
      }
    }

    return () => (
      <Form 
        handleSubmit={handleSubmit}>
        <FormItem 
          type="text"
          label="标签名"
          v-model={formData.name}
          onValidate={(validateField: 'emoji' | 'name') => handleFormCheck(validateField)}
          errorItem={errors['name']}
        >
        </FormItem>
        <FormItem 
          type="emoji"
          label="符号"
          v-model={formData.emoji}
          onValidate={(validateField: 'emoji' | 'name') => handleFormCheck(validateField)}
          errorItem={errors['emoji']}
        >
        </FormItem>
        <FormItem>
          <p class={s.tips}>长按标签即可进行编辑</p>
        </FormItem>
        <FormItem>
          <Button class={[s.formItem, s.button]}>确定</Button>
        </FormItem>
      </Form>
 
      // <form class={s.form} onSubmit={handleSubmit}>
      //   <div class={s.formRow}>
      //     <label class={s.formLabel}>
      //       <span class={s.formItem_name}>标签名</span>
      //       <div class={s.formItem_value}>
      //         <input 
      //           type="text" 
      //           maxlength="10"
      //           v-model={formData.name}
      //           class={[s.formItem, s.input, `${errors['name']?.length ? s.error : ''}`]}
      //           onInput={() => handleFormCheck('name')}
      //         />
      //       </div>
      //       <div class={[s.formItem_errorHint]}>
      //         <span>{errors['name']?.length ? errors['name']?.[0] : ''}</span>
      //       </div>
      //     </label>
      //   </div>
      //   <div class={s.formRow}>
      //     <label class={s.formLabel}>
      //       <span class={s.formItem_name}>
      //         <span>符号</span>
      //         <span class={s.emojiIcon}>{formData.emoji}</span>
      //       </span>
      //       <div class={s.formItem_value}>
      //         <EmojiSelect 
      //           v-model={formData.emoji} 
      //           class={[s.formItem, s.emojiList, `${errors['emoji']?.length ? s.error : ''}`]} 
      //           onChange={() => handleFormCheck('emoji')}
      //         />
      //       </div>
      //       <div class={[s.formItem_errorHint]}>
      //         <span>{errors['emoji']?.length ? errors['emoji']?.[0] : ''}</span>
      //       </div>
      //     </label>
      //   </div>
      //   <p class={s.tips}>长按标签即可进行编辑</p>
      //   <div class={s.formRow}>
      //     <div class={s.formItem_value}>
      //       <Button class={[s.formItem, s.button]}>确定</Button>
      //     </div>
      //   </div>
      // </form>     
    )
  }
})