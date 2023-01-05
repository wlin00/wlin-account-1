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
import { fetchMeInfo } from '../../utils/Me';

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
        // const res = await http.post<{ jwt: string }>('/session', formData, { params: { _mock: 'session' } })
        const res = await http.post<{ jwt: string }>('/session', formData)
        const returnTo = route.query.return_to?.toString() // 获取/sign_in?return_to的query参数
        // 登录成功后，localstorage存储token，后续的请求会携带在请求头
        localStorage.setItem('jwt', res.data.jwt)
        // 登录成功后，拉取用户信息接口，获取登陆pin，一般来说存放在全局store；
        /**  若不使用全局仓库，也可以使用promise来实现，思路如下：
          1、在一个通用的ts文件中向外暴露一个mePromise（默认值undefined)和一个更新mePromise的方法
          2、页面一加载或者登陆后，会将《拉取用户信息的promise》重新值赋予给mePromise，注意这里不进行await执行异步代码
          3、在全局路由拦截器中，如果进入特定的路由，则await mePromise，
            若走resolve分支则表示具备权限，后续再进入路由不会额外调用接口而是await一个普通的json变量；
            若走reject分支则表示当前用户不具备登陆态，则会被重定向回登录页面
        */
        fetchMeInfo()
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

    const handleIconClick = () => {
      history.back()
    }

    return () => (
      <MainLayout>
        {{
          title: () => '登录',
          icon: () => <Icon name="left" onClick={handleIconClick} />,
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