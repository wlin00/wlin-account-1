import { defineComponent, PropType, reactive, toRaw, computed, ref, onMounted } from 'vue';
import { Button } from '../../../../components/Button/Button';
import { Form, FormItem } from '../../../../components/Form/Form';
import { Rules, validate, FormError, Rule, hasError } from '../../../../utils/validate';
import s from './TagForm.module.scss';
import { http } from '../../../../utils/Http';
import { useRouter } from 'vue-router';
import { Toast } from 'vant'
import { Tag, Resource } from '../../../../utils/types';
import { Dialog } from 'vant'

type FormData = {
  name: string
  emoji: string
}

export const TagForm = defineComponent({
  props: {
    currentId: String,
    isEdit: Boolean
  },
  setup: (props, context) => {
    const router = useRouter()
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
      // 校验表单是否还有错误，如果有则不发送请求
        if (hasError(errors)) {
        return
      }
      handleTagSubmit() // 处理标签保存或删除
    }

    const handleTagSubmit = async () => {
      try {
        const kind = router.currentRoute.value.query?.kind || 'expenses' 
        if (!props.isEdit) { // 保存
          await http.post('/tags', {
            name: formData.name,
            sign: formData.emoji,
            kind,
          })
        } else { // 编辑
          await http.patch(`/tags/${props.currentId}`, {
            name: formData.name,
            sign: formData.emoji,
            kind,
          })
        }
        Toast.success(`${props.isEdit ? '编辑' : '创建'}成功`)
        setTimeout(() => {
          router.push('/items/create')
        }, 300)
      } catch {
      }
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

    const init = async () => {
      initData()
    }

    const initData = async () => { // 编辑状态，表单初始化；获取当前编辑的标签数据
      try {
        if (!props.isEdit || !props.currentId) {
          return
        }
        const res = await http.get<Resource<Tag>>(`/tags/${props.currentId}`)
        const resource = res.data.resource
        formData.emoji = resource.sign
        formData.name = resource.name
      } catch {
      }
    }

    const handleTagDelete = async () => {
      try {
        await Dialog.confirm({
          title: '是否删除标签',
          message: '确认删除标签和使用该标签的所有账单吗？',
        })
        await http.delete(`/tags/${props.currentId}`)
        Toast.success('删除成功')
        setTimeout(() => {
          router.push('/items/create')
        }, 300)
      } catch {
      }
    }

    onMounted(() => {
      init()
    })

    return () => (
      <Form 
        handleSubmit={handleSubmit}>
        <FormItem 
          type="text"
          label="标签名"
          validateCode='name'
          v-model={formData.name}
          onValidate={(validateField: 'emoji' | 'name') => handleFormCheck(validateField)}
          errorItem={errors['name']}
          placeholder={'请输入标签名'}
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
        {/* <FormItem>
          <p class={s.tips}>长按标签即可进行编辑</p>
        </FormItem> */}
        <FormItem>
          <Button type='submit' class={[s.formItem, s.button]}>确定</Button>
        </FormItem>
        {props.isEdit && <FormItem>
          <Button type='button' onClick={handleTagDelete} class={[s.formItem, s.button, s.danger]}>删除当前标签和对应账单</Button>
        </FormItem>}
      </Form> 
    )
  }
})