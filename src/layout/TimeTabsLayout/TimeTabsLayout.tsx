import { defineComponent, reactive, ref, toRaw, PropType, nextTick } from 'vue';
import { Form, FormItem } from '../../components/Form/Form';
import { OverlayIcon } from '../../components/Overlay/Overlay';
import { Tab, Tabs } from '../../components/Tabs/Tabs';
import { Time } from '../../utils/Time';
import { FormError, Rule, Rules, validate, hasError } from '../../utils/validate';
import { MainLayout } from '../MainLayout/MainLayout';
import { Overlay } from 'vant';
import s from './TimeTabsLayout.module.scss';

type FormData = {
  start: string
  end: string
}

const defineComponentInstance =  defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    }
  }
})

export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof defineComponentInstance>,
      required: true
    }
  },
  setup: (props, context) => {
    // ref
    const formData = reactive<FormData>({
      start: '',
      end: '',
    })
    const customTime = reactive<FormData>({
      start: '',
      end: '',
    })
    const errors = reactive<FormError<FormData>>({
      // 当前表单的错误类型默认为,key为string & value为string[]的对象
      start: [],
      end: []
    })
    const rules: Rules<FormData> = [
      { key: 'start', type: 'required', message: '请选择开始时间' },
      { key: 'end', type: 'required', message: '请选择结束时间' },
    ]
    const currentTab = ref<string>('currentMonth') // currentMonth 本月 ｜ lastMonth 上月 ｜ currentYear 今年 ｜ custom 自定义
    const time = new Time()

    const timeList = [
      { start: time.firstDayofMonth(), end: time.lastDayofMonth() }, // 本月
      { start: time.add(-1, 'month').firstDayofMonth(), end: time.add(-1, 'month').lastDayofMonth() }, // 上月
      { start: time.firstDayofYear(), end: time.lastDayofYear() }, // 今年
    ]
    const refOverlayVisible = ref(false)
    const loadFlag = ref(true)
    const loadFlagCustom = ref(false)

    // method
    const handleSubmit = async (e: Event) => { // 表单提交 & 手写表单校验
      e.preventDefault()
      // 调用表单校验方法
      handleFormCheck()
      console.log('error', toRaw(errors))
      if (hasError(errors)) {
        return
      }
      refOverlayVisible.value = false
      Object.assign(customTime, { ...formData })
      await nextTick()
      currentTab.value = 'custom'
      loadFlagCustom.value = false
      await nextTick()
      setTimeout(() => {
        loadFlagCustom.value = true
      })
    }
    const handleFormCheck = (validateField?: keyof FormData) => { //可传入validateField进行局部校验，并限制局部校验key约束在FormData的联合类型范围内
      if (!validateField) { // 若进行全量表单校验
        // 每次提交前清空表单校验
        Object.assign(errors, {
          start: [],
          end: [],
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
    const handleTabChange = async (tab: string) => {
      if (tab === 'custom') {
        refOverlayVisible.value = true
      } else {
        currentTab.value = tab
        loadFlag.value = false
        await nextTick()
        setTimeout(() => {
          loadFlag.value = true
        })
      }
    }

    return () => (
      <MainLayout>
        {{
          title: () => 'Wlin记账',
          icon: () => <OverlayIcon />,
          default: () => (<>
            <Tabs 
              classPrefix={'customTabs'} 
              value={currentTab.value} 
              onInput={(code: string) => handleTabChange(code)}
              class={s.tabs}
              useLazy
            >
              <Tab name="本月" code="currentMonth">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[0].start.format()}
                    endDate={timeList[0].end.format()} 
                  />
                }
              </Tab>
              <Tab name="上月" code="lastMonth">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[1].start.format()}
                    endDate={timeList[1].end.format()} 
                  />
                }
              </Tab>
              <Tab name="今年" code="currentYear">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[2].start.format()}
                    endDate={timeList[2].end.format()} 
                  />
                }
              </Tab>
              <Tab name="自定义时间" code="custom">
                {
                  loadFlagCustom.value &&
                  <props.component
                    startDate={customTime.start}
                    endDate={customTime.end} 
                  />
                }
              </Tab>
            </Tabs>
            <Overlay show={refOverlayVisible.value} class={s.overlay} >
              <div class={s.overlay_inner}>
                <header>
                  请选择时间
                </header>
                <main>
                  <Form onSubmit={handleSubmit}>
                    <FormItem 
                      label="开始时间" 
                      type="date" 
                      v-model={formData.start}
                      onValidate={(validateField: 'start' | 'end') => handleFormCheck(validateField)}
                      errorItem={errors['start']}
                      placeholder={'请选择开始时间'}
                    ></FormItem>
                    <FormItem 
                      label="结束时间" 
                      type="date" 
                      v-model={formData.end}
                      onValidate={(validateField: 'start' | 'end') => handleFormCheck(validateField)}
                      errorItem={errors['end']}
                      placeholder={'请选择结束时间'}
                    ></FormItem>
                    <FormItem>
                      <div class={s.actions}>
                        <button onClick={() => refOverlayVisible.value = false} type="button">取消</button>
                        <button onClick={handleSubmit} type="submit">确认</button>
                      </div>
                    </FormItem>

                  </Form>
                
                </main>
              </div>
            </Overlay>
          </>)
        }}
    </MainLayout>
  )}
})