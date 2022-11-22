import { defineComponent, PropType } from 'vue';
import s from './Tabs.module.scss';

export const Tabs = defineComponent({
  props: {
    value: {
      type: String,
      default: 'expense'
    },
    // onUpdateValue: {
    //   type: Function as PropType<(code: string) => void>
    // }
  },
  setup: (props, context) => {
    const { slots } = context
    const tabs = slots.default?.()
    console.log('ttt-tabs', tabs)
    if (!tabs?.length) {
      return () => null
    }
    for (let i = 0; i < tabs.length; i++) { // tabs[i].type 就是Tab组件，即一个defineComponent的实例
      // console.log('tp', tabs[i].type, Tab)
      if (tabs[i].type !== Tab) {
        throw new Error('<Tabs> only accepts <Tab> as children')
      }
    }
    const handleTabChange = (item: any) => {
      console.log('ttt', item.props.code, props.value)
      if (item.props.code === props.value) {
        return
      }
      context.emit('input', item.props.code)
    }

    return () => (
      <div class={s.tabs}>
        <ol class={s.tabs_nav}> {/* Tabs导航 */}
          { 
            tabs.map((item: any) => (
              <li 
                key={item.props.code}
                class={item.props.code === props.value ? s.selected : ''}
                onClick={() => handleTabChange(item)}
              >
                <span>{item.props.name}</span>
              </li>
            ))
          }
        </ol>
        <div> {/* Tabs选中区域 */}
          { tabs.find((item: any) => item.props.code === props.value) }
        </div>
      </div>
    )
  }
})

export const Tab = defineComponent({
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div>{
        slots.default?.()          
      }</div>
    )
  }
})