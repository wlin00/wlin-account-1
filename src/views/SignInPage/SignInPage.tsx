import { defineComponent, PropType, reactive, toRaw, ref } from 'vue';
import { Button } from '../../components/Button/Button';
import { Icon } from '../../components/CustomIcon/Icon';
import { Form, FormItem } from '../../components/Form/Form';
import { MainLayout } from '../../layout/MainLayout/MainLayout';
import s from './SignInPage.module.scss';
import { Rules, validate, FormError, Rule, hasError } from '../../utils/validate';
import axios from 'axios';
import { http } from '../../utils/Http';
import { useRouter, useRoute } from 'vue-router';

type FormData = {
  email: string
  code: string
}

export const SignInPage = defineComponent({
  setup: (props, context) => {
    // ref
    const validationCodeRef = ref()
    const router = useRouter()
    const route = useRoute()
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
      { key: 'email', type: 'pattern', message: '请输入正确的邮箱格式', regex: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ },
      { key: 'code', type: 'required', message: '请输入验证码'  },
      { key: 'code', type: 'pattern', message: '验证码长度不大于6', regex: /^.{1,6}$/ },
    ]

    // method
    const handleSubmit = (e: Event) => {
      e.preventDefault()
      // 调用表单校验方法
      handleFormCheck()
      // 校验表单是否还有错误，如果有则不发送请求
      if (hasError(errors)) {
        return
      }
      login()
    }

    const login = async () => {
      try {
        const res = await http.post<{ jwt: string }>('/session', formData)
        const returnTo = route.query.return_to?.toString()
        console.log('return_to', returnTo, route.query)
        // localStorage.setItem('jwt', res.data.jwt)
        router.push(returnTo || '/')
      } catch {

      }
    }

    const handleSendValidationCode = async () => {
      try { 
        await http.post('/validation_codes', {  email: formData.email })
        // 调用验证码接口后，开始60秒倒计时
        validationCodeRef.value?.startCountDown()
      } catch(err) {
        console.log('catch - err', err)
      }
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
                errors={errors}
                placeholder='请输入邮箱，然后发送验证码'
                v-model={formData.email}
                errorItem={errors['email']}
                onValidate={(validateField: 'email' | 'code') => handleFormCheck(validateField)}
              />  
              <FormItem
                label="验证码"
                type='validationCode'
                validateCode='code'
                ref={validationCodeRef}
                placeholder='请输入验证码'
                v-model={formData.code}
                errors={errors}
                errorItem={errors['code']}
                onValidate={(validateField: 'email' | 'code') => handleFormCheck(validateField)}
                onSendValidationCode={handleSendValidationCode}
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