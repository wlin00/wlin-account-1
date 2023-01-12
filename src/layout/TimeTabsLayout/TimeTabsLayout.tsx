import { defineComponent, reactive, ref, toRaw, PropType, nextTick, onMounted } from 'vue';
import { Form, FormItem } from '../../components/Form/Form';
import { OverlayIcon } from '../../components/Overlay/Overlay';
import { Tab, Tabs } from '../../components/Tabs/Tabs';
import { Time } from '../../utils/Time';
import { FormError, Rule, Rules, validate, hasError } from '../../utils/validate';
import { MainLayout } from '../MainLayout/MainLayout';
import { Overlay, Toast } from 'vant';
import { useStorage } from '@vueuse/core'
import s from './TimeTabsLayout.module.scss';
import { init } from 'echarts';

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
      // type: Object as PropType<typeof defineComponentInstance>,
      type: Object as PropType<any>,
      required: true
    }
  },
  setup: (props, context) => {
    // ref
    const formData = reactive<FormData>({
      start: '',
      end: '',
    })

    const customTimeStart = ref<any>(useStorage('customTimeStart', ''))
    const customTimeEnd = ref<any>(useStorage('customTimeEnd', ''))

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
    const handleDateValidate = async (formData: FormData) => { // 校验自定义时间是否规范（1、开始结束不能相等；2、开始时间不能晚于（大于）结束时间）
      try {
        const startTime = new Date(formData.start).getTime()
        const endTime = new Date(formData.end).getTime()
        if (startTime >= endTime) {
          Toast.fail('开始时间需早于结束时间')
          return false
        }
        return true
      } catch {
        return false
      }
    }
    const handleSubmit = async (e: Event) => { // 表单提交 & 手写表单校验
      e.preventDefault()
      // 调用表单校验方法
      handleFormCheck()
      console.log('error', toRaw(errors))
      if (hasError(errors)) {
        return
      }
      const dateValidateFlag = await handleDateValidate(formData)
      if (!dateValidateFlag) {
        return
      }
      refOverlayVisible.value = false
      customTimeStart.value = formData.start
      customTimeEnd.value = formData.end
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
    const handleRefresh = () => {
      handleTabChange(currentTab.value)
    }
    const handleTabChange = async (tab: string) => {
      if (tab === 'custom') { // 若当前已经选择过自定义时间，则下次进入tab可不再选择，如果想修改可以点击tab内的icon
        if (!customTimeStart.value || !customTimeEnd.value) {
          refOverlayVisible.value = true
          return 
        }
        currentTab.value = tab
        loadFlagCustom.value = false
        await nextTick()
        setTimeout(() => {
          loadFlagCustom.value = true
        })
      } else {
        currentTab.value = tab
        loadFlag.value = false
        await nextTick()
        setTimeout(() => {
          loadFlag.value = true
        })
      }
    }

    const handleIconClick = () => {
      console.log('icon~~~')
      refOverlayVisible.value = true
    }

    const init = async () => { // 自定义表单初始化数据同步
      formData.start = customTimeStart.value
      formData.end = customTimeEnd.value
    }

    onMounted(() => {
      init()
    })

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
              onIconClick={handleIconClick}
            >
              <Tab name="本月" code="currentMonth">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[0].start.format()}
                    endDate={timeList[0].end.format()}
                    onRefresh={handleRefresh}
                  />
                }
              </Tab>
              <Tab name="上月" code="lastMonth">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[1].start.format()}
                    endDate={timeList[1].end.format()} 
                    onRefresh={handleRefresh}
                  />
                }
              </Tab>
              <Tab name="今年" code="currentYear">
                {
                  loadFlag.value && 
                  <props.component
                    startDate={timeList[2].start.format()}
                    endDate={timeList[2].end.format()} 
                    onRefresh={handleRefresh}
                  />
                }
              </Tab>
              <Tab 
                name="自定义时间" 
                code="custom"
                navIcon="edit"
                >
                {
                  loadFlagCustom.value &&
                  <props.component
                    startDate={customTimeStart.value}
                    endDate={customTimeEnd.value} 
                    onRefresh={handleRefresh}
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