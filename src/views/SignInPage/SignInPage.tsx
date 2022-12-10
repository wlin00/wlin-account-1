import { defineComponent, PropType, reactive, toRaw } from 'vue';
import { Button } from '../../components/Button/Button';
import { Icon } from '../../components/CustomIcon/Icon';
import { Form, FormItem } from '../../components/Form/Form';
import { MainLayout } from '../../layout/MainLayout/MainLayout';
import s from './SignInPage.module.scss';
import { Rules, validate, FormError, Rule } from '../../utils/validate';

type FormData = {
  email: string
  code: string
}

export const SignInPage = defineComponent({
  setup: (props, context) => {
    // ref
    const formData = reactive<FormData>({
      email: '',
      code: '',
    })
    const errors = reactive<FormError<FormData>>({
      // 当前表单的错误类型默认为,key为string & value为string[]的对象
      email: [],
      code: [],
    })
    const rules: Rules<FormData> = [
      { key: 'email', type: 'required', message: '请输入邮箱'  },
      { key: 'code', type: 'required', message: '请输入验证码'  },
    ]

    // method
    const handleSubmit = (e: Event) => {
      e.preventDefault()
      // 调用表单校验方法
      handleFormCheck()
      console.log('error', toRaw(errors))
    }

    const handleFormCheck = (validateField?: keyof FormData) => {
      if (!validateField) { // 若进行全量表单校验
        // 每次提交前清空表单校验
        Object.assign(errors, {
          email: [],
          code: [],
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
      <MainLayout>
        {{
          title: () => '登录',
          icon: () => <Icon name="left" />,
          default: () => (<>
            <div class={s.wrapper}>
            <div class={s.logo}>
              <Icon class={s.icon} name="mangosteen" />
              <h1 class={s.appName}>Wlin记账</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <FormItem
                label="邮箱地址"
                type="text"
                validateCode='email'
                placeholder='请输入邮箱，然后发送验证码'
                v-model={formData.email}
                errorItem={errors['email']}
                onValidate={(validateField: 'email' | 'code') => handleFormCheck(validateField)}
              />  
              <FormItem
                label="验证码"
                type='validationCode'
                placeholder='请输入验证码'
                v-model={formData.code}
                errorItem={errors['code']}
                onValidate={(validateField: 'email' | 'code') => handleFormCheck(validateField)}
              /> 
              <div class={s.submit_wrap}>
                <Button class={s.submit_btn} onClick={handleSubmit}>登录</Button>
              </div>
            </Form>
            </div>  
          </>)
        }}
      </MainLayout>
    )

  }
})