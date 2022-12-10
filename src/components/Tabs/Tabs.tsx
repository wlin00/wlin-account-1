import { defineComponent, PropType } from 'vue';
import s from './Tabs.module.scss';

export const Tabs = defineComponent({
  props: {
    value: {
      type: String,
      default: 'expense'
    },
    classPrefix: {
      type: String
    }
  },
  emits: ['change', 'input'],
  setup: (props, context) => {
    return () => {
      const { slots } = context
      const tabs = slots.default?.()
      if (!tabs?.length) {
        return () => null
      }
      for (let i = 0; i < tabs.length; i++) { // tabs[i].type 就是Tab组件，即一个defineComponent的实例
        if (tabs[i].type !== Tab) {
          throw new Error('<Tabs> only accepts <Tab> as children')
        }
      }
      const classPrefix = props.classPrefix

      const handleTabChange = (item: any) => {
        // if (item.props.code === props.value) {
        //   return
        // }
        context.emit('input', item.props.code)
      }

      return (<div class={[s.tabs, classPrefix + '_tabs']}>
        <ol class={[s.tabs_nav, classPrefix + '_tabs_nav']}> {/* Tabs导航 */}
          { 
            tabs.map((item: any) => (
              <li 
                key={item.props.code}
                class={[item.props.code === props.value ? s.selected : '', classPrefix + '_tabs_nav_item']}
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
      </div>)
    }
  }
})

export const Tab = defineComponent({
  props: {
    name: String,
    code: String,
  },
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div>{
        slots.default?.()          
      }</div>
    )
  }
})